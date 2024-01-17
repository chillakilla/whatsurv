'use client';
import Tab from '../_components/Tab';
import Banner from './_components/carousel/Banner';
import Popular from './_components/carousel/Popular';
import PostIt from '../(public)/survey-it/page';
import FloatingBtn from './_components/FloatingBtn';
import PostBeauty from '../(public)/survey-beauty/page';
import PostMedi from '../(public)/survey-medical/page';
import {useState} from 'react';

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState<string>('IT');
  const renderContent = () => {
    switch (selectedTab) {
      case 'IT':
        return <PostIt />;
      case 'BEAUTY':
        return <PostBeauty />;
      case 'MEDICAL':
        return <PostMedi />;
      default:
        return <PostIt />;
    }
  };

  return (
    <div>
      <Tab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto mb-20">
        <Banner />
        <Popular />
        {renderContent()}
        <FloatingBtn />
      </div>
    </div>
  );
}
