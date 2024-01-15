import React from 'react';
import Link from 'next/link';
export default function Tab() {
  return (
    <nav className="h-12 border-b-1">
      <ul className="flex items-center divide-x-2 text-center h-12 ml-[70px]">
        <Link href="/survey-it">
          <li className="w-24 hover:text-[#0051FF]">IT</li>
        </Link>
        <Link href="/survey-beauty">
          <li className="w-24 hover:text-[#0051FF]">BEAUTY</li>
        </Link>
        <Link href="/survey-medical">
          <li className="w-24 hover:text-[#0051FF]">MEDICAL</li>
        </Link>
        <Link href="/survey-lite">
          <li className="w-24 hover:text-[#0051FF]">LITE</li>
        </Link>
      </ul>
    </nav>
  );
}