import React from 'react';

export default function FeedBack() {
  return (
    <div>
      <form className="bg-slate-300 h-52 p-4 flex flex-col justify-between">
        <h3 className="text-xl font-semibold">이용 중에 불편하신 사항이 있으신가요?</h3>
        <p>
          더 나은 whatSurv을 위해 고객님의 피드백을 보내주세요!
          <br />
          문의 메일: whatsurvvvv@gmail.com
        </p>
        <div className="flex gap-4">
          <input type="text" placeholder="소중한 의견 감사합니다!" className="w-[500px] h-[40px] p-4" />
          <button className="bg-[#0051FF] text-white w-[80px] h-[40px]">보내기</button>
        </div>
      </form>
    </div>
  );
}
