import Link from 'next/link';
import Tab from './Tab';

export default function Header() {
  return (
    <header>
      <section className="flex justify-between items-center border-b-1">
        <div className="flex items-center justify-center w-80">
          <Link href="/">
            <h1 className="font-bold text-xl">What Surv?</h1>
          </Link>
        </div>
        <div className="w-80 flex justify-center gap-4 p-2">
          <Link href="/join">
            <button className="w-[64px] h-[30px] border-2 border-[#ddd] rounded-full text-sm">Join</button>
          </Link>
          <Link href="/auth">
            <button className="w-[64px] h-[30px] bg-[#0051FF] rounded-full text-white text-sm">Login</button>
          </Link>
        </div>
      </section>
      <Tab />
    </header>
  );
}
