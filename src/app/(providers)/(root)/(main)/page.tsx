'use client';
import Banner from './_components/carousel/Banner';
import Popular from './_components/carousel/Popular';
import PostIt from './_components/post/PostIt';
import FloatingBtn from './_components/FloatingBtn';
import PostBeauty from './_components/post/PostBeauty';
import PostMedi from './_components/post/PostMedi';
import PostLite from './_components/post/PostLite';

export default function MainPage() {
  return (
    <div className="flex-col items-center justify-center">
      <Banner />
      <Popular />
      <PostIt />
      <PostBeauty />
      <PostMedi />
      <PostLite />
      <FloatingBtn />
    </div>
  );
}
