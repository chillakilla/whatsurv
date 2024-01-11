import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="flex justify-between items-center border-b-2 p-4">
      <section className="flex items-center justify-evenly w-1/2">
        <div>
          <h1 className="font-bold text-xl">What Surv?</h1>
        </div>
        <Navigation />
      </section>
      <section className="w-1/2 flex justify-end gap-4">
        <Link href="/join">
          <button className="w-[80px] h-[40px] border-2 border-[#ddd] rounded-xl">Join</button>
        </Link>
        <Link href="/auth">
          <button className="w-[80px] h-[40px] bg-[#00709F] rounded-xl text-white">Login</button>
        </Link>
      </section>
    </header>
  );
}
