import Link from 'next/link';
import React from 'react';

export default function Navigation() {
  return (
    <nav>
      <ul className="flex items-center divide-x-2 text-center">
        <Link href="/survey_it">
          <li className="w-24 hover:text-[#00709F]">IT</li>
        </Link>
        <Link href="/survey_beauty">
          <li className="w-24 hover:text-[#00709F]">BEAUTY</li>
        </Link>
        <Link href="/survey_medical">
          <li className="w-24 hover:text-[#00709F]">MEDICAL</li>
        </Link>
        <Link href="/survey_lite">
          <li className="w-24 hover:text-[#00709F]">LITE</li>
        </Link>
      </ul>
    </nav>
  );
}
