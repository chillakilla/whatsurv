'use client';
import FloatingBtn from './_components/FloatingBtn';
import Banner from './_components/carousel/Banner';
import ItList from './_components/carousel/ItList';
import FeedBack from './_components/post/FeedBack';
import Popular from './_components/carousel/Popular';

export default function MainPage() {
  return (
    <div>
      <Banner />
      <div className="flex-col items-center justify-center w-[88.5rem] m-auto ">
        <Popular />
        <ItList />
        <FeedBack />
        <FloatingBtn />
      </div>
    </div>
  );
}
