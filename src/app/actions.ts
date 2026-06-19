'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

// --- Mock DB Helper ---
function getMockDb() {
  const dbPath = path.join(process.cwd(), 'mock-db.json');
  if (!fs.existsSync(dbPath)) {
    const defaultData = {
      users: [
        { id: '1', username: "patient1", email: "patient1@mindwell.com", role: "patient", active: true },
        { id: '2', username: "sarah_jenkins", email: "sarah.jenkins@mindwell.com", role: "therapist", active: true },
        { id: '3', username: "john_doe", email: "john.doe@gmail.com", role: "patient", active: true },
        { id: '4', username: "michael_rowe", email: "m.rowe@mindwell.com", role: "therapist", active: true },
        { id: '5', username: "admin_main", email: "admin@mindwell.com", role: "admin", active: true },
        { id: '6', username: "alice_s", email: "alice.s@email.com", role: "patient", active: false },
      ]
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Inject mock patient profile if missing
  if (!db.patient_profiles) {
    db.patient_profiles = [
      {
        id: 1, user_id: '11111111-1111-1111-1111-111111111111',
        full_name: "Alex Johnson", age: 28, gender: "Non-binary",
        phone_number: "+1 (555) 123-4567", emergency_contact: "Sarah Johnson (Sister) - 555-987-6543",
        location: "Seattle, WA", primary_concern: "Generalized Anxiety and Work Burnout",
        risk_level: "low", created_at: new Date().toISOString()
      }
    ];
    saveMockDb(db);
  }
  return db;
}

function saveMockDb(data: any) {
  const dbPath = path.join(process.cwd(), 'mock-db.json');
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// --- Users ---
export async function getUsers() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
      return getMockDb().users;
    }

    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: true })
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    return data
  } catch (err) {
    console.warn('Backend not configured or failed, using local mock data:', err);
    return getMockDb().users;
  }
}

export async function toggleUserActive(userId: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('users').update({ active }).eq('id', userId)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function signUpUser(username: string, email: string, password: string, role: string) {
  try {
    // If Supabase isn't configured yet, save to local mock DB!
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
      const db = getMockDb();
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        role,
        active: true
      };
      db.users.push(newUser);
      saveMockDb(db);
      console.warn('Supabase not configured, saved new user to mock-db.json.');
      return { success: true, data: newUser };
    }

    const supabase = await createClient();
    
    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Error signing up with auth:', authError);
      return { success: false, error: authError.message };
    }

    // 2. Insert into public.users
    const userId = authData.user?.id || undefined;
    const { data, error } = await supabase.from('users').insert({
      id: userId,
      username,
      email,
      role
    }).select().single();

    if (error) {
      console.error('Error inserting into public.users:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true, data };
  } catch (err: any) {
    console.error('Exception during signup:', err);
    return { success: false, error: err.message };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
      const db = getMockDb();
      const user = db.users.find((u: any) => u.email === email);
      if (!user) {
        return { success: false, error: "Invalid login credentials (Mock DB)." };
      }
      console.warn('Supabase not configured, simulating login for UI testing.');
      return { success: true, data: user };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true, data };
  } catch (err: any) {
    console.error('Exception during login:', err);
    return { success: false, error: err.message };
  }
}

// --- Mood Logs ---
export async function getMoodLogs(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    const logs = (db.mood_logs || []).filter((l: any) => l.user_id === userId);
    return logs.map((log: any) => ({
      ...log,
      date: new Date(log.date || log.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  }
  const supabase = await createClient()
  const { data, error } = await supabase.from('mood_logs').select('*').eq('user_id', userId).order('created_at', { ascending: true })
  if (error) {
    console.error('Error fetching mood logs:', error)
    return []
  }
  // Convert dates to display format
  return data.map(log => ({
    ...log,
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))
}

export async function addMoodLog(userId: string, score: number, emoji: string, label: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('mood_logs').insert({
    user_id: userId,
    score,
    emoji,
    label
  })
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

// --- Appointments ---
export async function getAppointments(userId?: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    let appts = db.appointments || [];
    if (userId) appts = appts.filter((a: any) => a.user_id === userId);
    return appts;
  }
  const supabase = await createClient()
  let query = supabase.from('appointments').select('*').order('date', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  if (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
  return data
}

export async function bookAppointment(userId: string, therapistName: string, date: string, time: string, email: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('appointments').insert({
    user_id: userId,
    therapist_name: therapistName,
    date,
    time,
    status: 'pending',
    email
  }).select().single()
  
  if (error) throw new Error(error.message)
  revalidatePath('/')
  return data
}

export async function updateAppointmentStatus(id: number, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') {
  const supabase = await createClient()
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}

// --- Chat Messages ---
export async function getChatMessages(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    return (db.chat_messages || []).filter((c: any) => c.user_id === userId);
  }
  const supabase = await createClient()
  const { data, error } = await supabase.from('chat_messages').select('*').eq('user_id', userId).order('created_at', { ascending: true })
  if (error) {
    console.error('Error fetching chat messages:', error)
    return []
  }
  return data
}

export async function sendChatMessage(userId: string, text: string, sender: 'user' | 'aura', timestamp: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    text,
    sender,
    timestamp
  }).select().single()
  
  if (error) throw new Error(error.message)
  revalidatePath('/')
  return data
}

// --- Categories & Resources ---
export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true })
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
}

export async function getResources() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }
  return data
}

export async function addCategory(name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').insert({ name }).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/')
  return data
}

export async function addResource(title: string, category: string, type: 'article' | 'video' | 'exercise', urlOrBody: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('resources').insert({
    title,
    category,
    type,
    url_or_body: urlOrBody
  }).select().single()
  
  if (error) throw new Error(error.message)
  revalidatePath('/')
  return data
}

// --- Advanced Modules ---

// Assessments
export async function getAssessments(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    return (db.assessments || []).filter((a: any) => a.user_id === userId);
  }
  const supabase = await createClient()
  const { data } = await supabase.from('assessments').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function addAssessment(userId: string, type: string, score: number, answers: any) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    if (!db.assessments) db.assessments = [];
    const newRecord = { id: Date.now(), user_id: userId, type, score, answers, created_at: new Date().toISOString() };
    db.assessments.push(newRecord);
    saveMockDb(db);
    revalidatePath('/')
    return newRecord;
  }
  const supabase = await createClient()
  const { data } = await supabase.from('assessments').insert({ user_id: userId, type, score, answers }).select().single()
  revalidatePath('/')
  return data
}

// Journal Entries
export async function getJournalEntries(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    return (db.journal_entries || []).filter((a: any) => a.user_id === userId);
  }
  const supabase = await createClient()
  const { data } = await supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function addJournalEntry(userId: string, title: string, content: string, mood_linked: string | null = null, is_voice_generated: boolean = false) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    if (!db.journal_entries) db.journal_entries = [];
    const newRecord = { id: Date.now(), user_id: userId, title, content, mood_linked, is_voice_generated, created_at: new Date().toISOString() };
    db.journal_entries.push(newRecord);
    saveMockDb(db);
    revalidatePath('/')
    return newRecord;
  }
  const supabase = await createClient()
  const { data } = await supabase.from('journal_entries').insert({ user_id: userId, title, content, mood_linked, is_voice_generated }).select().single()
  revalidatePath('/')
  return data
}

// Activity Logs
export async function getActivityLogs(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    return (db.activity_logs || []).filter((a: any) => a.user_id === userId);
  }
  const supabase = await createClient()
  const { data } = await supabase.from('activity_logs').select('*').eq('user_id', userId).order('completed_at', { ascending: false })
  return data || []
}

export async function addActivityLog(userId: string, activity_type: string, duration_minutes: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    if (!db.activity_logs) db.activity_logs = [];
    const newRecord = { id: Date.now(), user_id: userId, activity_type, duration_minutes, completed_at: new Date().toISOString() };
    db.activity_logs.push(newRecord);
    saveMockDb(db);
    revalidatePath('/')
    return newRecord;
  }
  const supabase = await createClient()
  const { data } = await supabase.from('activity_logs').insert({ user_id: userId, activity_type, duration_minutes }).select().single()
  revalidatePath('/')
  return data
}

// Goals
export async function getGoals(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    return (db.goals || []).filter((a: any) => a.user_id === userId);
  }
  const supabase = await createClient()
  const { data } = await supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function addGoal(userId: string, title: string, target_value: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    if (!db.goals) db.goals = [];
    const newRecord = { id: Date.now(), user_id: userId, title, target_value, current_value: 0, status: 'in_progress', created_at: new Date().toISOString() };
    db.goals.push(newRecord);
    saveMockDb(db);
    revalidatePath('/')
    return newRecord;
  }
  const supabase = await createClient()
  const { data } = await supabase.from('goals').insert({ user_id: userId, title, target_value, status: 'in_progress' }).select().single()
  revalidatePath('/')
  return data
}

export async function updateGoalStatus(id: number, current_value: number, status: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    if (!db.goals) db.goals = [];
    const goal = db.goals.find((g: any) => g.id === id);
    if (goal) {
       goal.current_value = current_value;
       goal.status = status;
       saveMockDb(db);
       revalidatePath('/')
    }
    return goal;
  }
  const supabase = await createClient()
  const { data } = await supabase.from('goals').update({ current_value, status }).eq('id', id).select().single()
  revalidatePath('/')
  return data
}

// Habits
export async function getHabits(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    return (db.habits || []).filter((a: any) => a.user_id === userId);
  }
  const supabase = await createClient()
  const { data } = await supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function addHabit(userId: string, title: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    if (!db.habits) db.habits = [];
    const newRecord = { id: Date.now(), user_id: userId, title, streak: 0, last_completed: null, created_at: new Date().toISOString() };
    db.habits.push(newRecord);
    saveMockDb(db);
    revalidatePath('/')
    return newRecord;
  }
  const supabase = await createClient()
  const { data } = await supabase.from('habits').insert({ user_id: userId, title }).select().single()
  revalidatePath('/')
  return data
}

export async function incrementHabitStreak(id: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    if (!db.habits) db.habits = [];
    const habit = db.habits.find((h: any) => h.id === id);
    if (habit) {
       habit.streak += 1;
       habit.last_completed = new Date().toISOString();
       saveMockDb(db);
       revalidatePath('/')
    }
    return habit;
  }
  const supabase = await createClient()
  
  const { data: current } = await supabase.from('habits').select('streak').eq('id', id).single()
  const newStreak = (current?.streak || 0) + 1;

  const { data } = await supabase.from('habits').update({ streak: newStreak, last_completed: new Date().toISOString() }).eq('id', id).select().single()
  revalidatePath('/')
  return data
}

// --- Patient Profile ---

export async function getPatientProfile(userId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    const db = getMockDb();
    return (db.patient_profiles || []).find((p: any) => p.user_id === userId) || null;
  }
  const supabase = await createClient()
  const { data } = await supabase.from('patient_profiles').select('*').eq('user_id', userId).single()
  return data || null;
}

export async function getTherapistPatientData(userId: string) {
  const [profile, moods, assessments, journals, activities, goals, habits] = await Promise.all([
    getPatientProfile(userId),
    getMoodLogs(userId),
    getAssessments(userId),
    getJournalEntries(userId),
    getActivityLogs(userId),
    getGoals(userId),
    getHabits(userId)
  ]);

  return {
    profile,
    moods,
    assessments,
    journals,
    activities,
    goals,
    habits
  };
}
