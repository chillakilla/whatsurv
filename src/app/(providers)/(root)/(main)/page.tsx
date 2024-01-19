'use client';

import {useSearchParams} from 'next/navigation';
import {useState} from 'react';

import Tab from '../_components/Tab';
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

// 1. IT, Beauty, Medical 을 메인 페이지 & Lite는 다른 페이지로 만든다
// 2. PostIT, PostBeauty, PostMedi 를 하나의 컴포넌트로 만든다
// 3. Lite 클릭 시 /survey-lite 페이지로 이동한다. (같은 페이지의 경우 이동 X)
// 4. IT, Beauty, Medical 클릭 시 / 페이지로 이동한다. (같은 페이지의 경우 이동 X)
