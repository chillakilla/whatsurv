'use client';

import {useSearchParams} from 'next/navigation';
import {useState} from 'react';
import FloatingBtn from './_components/FloatingBtn';
import Banner from './_components/carousel/Banner';
import Popular from './_components/carousel/Popular';
import SurveyPost from './_components/post/SurveyPost';

export default function MainPage() {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState({
    name: searchParams.get('tab') || 'IT',
    to: '/', // ?
  });

  return (
    <div>
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
        <Banner />
        <Popular />
        <SurveyPost target={selectedTab.name} />
        <FloatingBtn />
      </div>
    </div>
  );
}
