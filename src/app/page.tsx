import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect users to the login page immediately when they hit the root URL
  redirect('/login');
}
