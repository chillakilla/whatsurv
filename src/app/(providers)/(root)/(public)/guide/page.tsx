'use client';
import React, {useState} from 'react';

export default function WhatSurvGuidePage() {
  const surveyParticipation = [
    {
      title: '회원가입, 로그인',
      content: '기존 사용자는 로그인, 신규 사용자는 회원가입을 진행해주세요.',
    },
    {
      title: '참여하고자 하는 설문 탭 선택',
      content: '참여하고자 하는 설문 탭을 선택해주세요. (ITsurv, 참여해surv)',
    },
    {
      title: '참여하고 싶은 설문 선택',
      content: '원하는 설문을 선택하여 주세요.',
    },
    {
      title: '참여하기',
      content: '참여하기 버튼을 누르고 설문조사를 진행해주세요.',
    },
  ];
  const surveyCreator = [
    {
      title: '회원가입, 로그인',
      content: '기존 사용자는 로그인, 신규 사용자는 회원가입을 진행해주세요.',
    },
    {
      title: '생성하고자 하는 설문 탭 선택',
      content: '생성하고자 하는 설문 탭을 선택해주세요. (ITsurv, 참여해surv)',
    },
    {
      title: '설문지 생성 버튼 클릭',
      content: '원하는 설문 페이지에서 설문 생성하기 버튼을 클릭해주세요.',
    },
    {
      title: '질문 생성 및 조건 설정',
      content: '설문지에 들어갈 조건과 질문을 입력해주세요.',
    },
    {
      title: '설문 등록',
      content: '설문을 등록하세요!',
    },
  ];

  const [selectedTab, setSelectedTab] = useState<string | null>(surveyParticipation[0].title);
  const clickTabHandler = (title: string | null) => {
    setSelectedTab(selectedTab === title ? null : title);
  };

  return (
    <div className="flex-col items-center justify-center w-[88.5rem] m-auto mt-20">
      <h1 className="text-3xl font-semibold">
        <span className="text-[#0051ff]">WhatSurv</span> 이용 안내
      </h1>
      <p className="line-relaxed mt-4 mb-12">
        WhatSurv은 설문조사 참여 및 생성하는 서베이 웹 서비스 입니다. <br />
        처음 WhatSurv을 이용하시는데 어려움이 있으시다면 이용안내 가이드를 읽어보시고 많은 이용 부탁드립니다.
      </p>
      <div>
        <div className="bg-white h-[50px] text-lg font-semibold flex items-center p-4">설문 참여자</div>
        <div className="flex flex-col mt-2 ">
          {surveyParticipation.map(survey => (
            <ul className="w-full flex divide-x" key={survey.title}>
              <li
                className={`w-64 h-12 flex items-center p-4 text-sm justify-start divide-x border-b-1 border-[#eee] cursor-pointer ${
                  selectedTab === survey.title ? 'bg-[#0051ff] text-white' : 'bg-white text-[#666]'
                }`}
                onClick={() => clickTabHandler(survey.title)}
              >
                <a href="#">{survey.title}</a>
              </li>
              <div
                className={`bg-white p-2 items-center text-sm w-[1160px] h-12 flex border-b-1 border-[#eee] ${
                  selectedTab === survey.title ? 'text-black' : 'text-[#666]'
                }`}
              >
                {survey.content}
              </div>
            </ul>
          ))}
        </div>
      </div>
      <div className="mt-12">
        <div className="bg-white h-[50px] text-lg font-semibold flex items-center p-4 ">설문 생성자</div>
        <div className="flex flex-col mt-2 ">
          {surveyCreator.map(survey => (
            <ul className="w-full flex divide-x" key={survey.title}>
              <li
                className={`w-64 h-12 flex items-center p-4 text-sm justify-start divide-x border-b-1 border-[#eee] cursor-pointer ${
                  selectedTab === survey.title ? 'bg-[#0051ff] text-white' : 'bg-white text-[#666]'
                }`}
                onClick={() => clickTabHandler(survey.title)}
              >
                <a href="#">{survey.title}</a>
              </li>
              <div
                className={`bg-white p-2 items-center text-sm w-[1160px] h-12 flex border-b-1 border-[#eee] ${
                  selectedTab === survey.title ? 'text-black' : 'text-[#666]'
                }`}
              >
                {survey.content}
              </div>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
