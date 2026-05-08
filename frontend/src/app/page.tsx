import { redirect } from 'next/navigation';

export default function Home() {
  // As an internal platform, B-EMS routes directly to the secure login gateway.
  redirect('/ems/login');
}
