'use client';
import Banner from './_components/Banner';
import Popular from './_components/Popular';
import PostIt from './_components/PostIt';

export default function MainPage() {
  return (
    <div className="flex-col items-center justify-center">
      <form className="flex items-center justify-center mt-16">
        <input placeholder="검색창" className="bg-[#eee] h-[45px] w-[600px] p-2 rounded-xl" />
      </form>
      <Banner />
      <Popular />
      <PostIt />
    </div>
  );
}
