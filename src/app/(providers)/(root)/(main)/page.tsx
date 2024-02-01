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
      </div>
    </div>
  );
}

// 이 사이트를 이용하는 고객 성별 연령 추이한 결과표 보여주기
// 우리 사이트는 현재 ~연령층과 ~성별 몇 프로 추이 합산 해서 ~명의 사용자가 있다. 믿을만한 사이트다다
