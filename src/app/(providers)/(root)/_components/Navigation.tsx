import Link from 'next/link';
import React from 'react';

export default function Navigation() {
  return (
    <nav>
      <ul className="flex items-center divide-x-2 text-center">
        <Link href="/survey_it">
          <li className="w-24 hover:text-[#0051FF]">IT</li>
        </Link>
        <Link href="/survey_beauty">
          <li className="w-24 hover:text-[#0051FF]">BEAUTY</li>
        </Link>
        <Link href="/survey_medical">
          <li className="w-24 hover:text-[#0051FF]">MEDICAL</li>
        </Link>
        <Link href="/survey_lite">
          <li className="w-24 hover:text-[#0051FF]">LITE</li>
        </Link>
      </ul>
    </nav>
  );
}
