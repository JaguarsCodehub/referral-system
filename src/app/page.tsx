import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1>Referral App</h1>
      <button className='bg-black text-white'>
        <Link href='/sign-up'>Go to Auth</Link>
      </button>
    </main>
  );
}
