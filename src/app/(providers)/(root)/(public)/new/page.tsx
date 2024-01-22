'use client';

import {useSearchParams} from 'next/navigation';
import {useState} from 'react';

import FloatingBtn from '../../(main)/_components/FloatingBtn';
import Banner from '../../(main)/_components/carousel/Banner';
import Tab from '../../_components/Tab';

import Popular from '../../(main)/_components/carousel/Popular';
import SurveyPost from '../../(main)/_components/post/SurveyPost';

export default function MainPage() {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState({
    name: searchParams.get('tab') || 'LITE',
    to: '/', // ?
  });

  return (
    <div>
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
        <Banner />
        <Popular />
        <SurveyPost target={selectedTab.name} />
        <FloatingBtn />
      </div>
    </div>
  );
}
