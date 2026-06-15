import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Live - Ajker Khela',
  description: 'Live streaming page redirects to the homepage.'
};

export default function LiveRedirectPage() {
  redirect('/');
}
