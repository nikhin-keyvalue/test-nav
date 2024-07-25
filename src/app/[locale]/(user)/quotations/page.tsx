import { redirect } from 'next/navigation';

export default async function Quotations() {
  return redirect('/quotations/new');
}
