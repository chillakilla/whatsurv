import React from 'react';
import Link from 'next/link';

export default function FeedBack() {
  return (
    <>
      <h3 className="text-xl font-bold">
        <span className="text-[#0051ff]">참여해</span> Surv
      </h3>
      <div className="flex gap-2 mt-4">
        <Link href="/survey-lite">
          <img src="/image/001.png" alt="참여해surv 이미지" />
        </Link>
        <Link href="/survey-lite">
          <img src="/image/002.png" alt="참여해surv 이미지" />
        </Link>
      </div>
    </>
  );
}
