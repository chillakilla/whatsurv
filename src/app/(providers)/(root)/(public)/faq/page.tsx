import TypingAnimation from './_components/TypingAnimation';
import {TbWorld} from 'react-icons/tb';
import {PiHandWavingFill} from 'react-icons/pi';
import {AiOutlineFileSearch} from 'react-icons/ai';
import {MdSecurity} from 'react-icons/md';

export default function FaqPage() {
  const staticTextStart = 'What Surv은 ';
  const staticTextEnd = ' 서비스 입니다.';
  return (
    <div className="flex-col items-center justify-center w-[88.5rem] m-auto mt-10">
      <div className="about  p-4  flex flex-col items-center">
        <div className="w-[981px] h-24 flex justify-center">
          <h1 className="text-3xl w-[95%] flex justify-between font-bold">
            {staticTextStart}
            <TypingAnimation text={'리서치 모객 및 사용자 테스트를 제공하는 '} />
            {staticTextEnd}
          </h1>
        </div>
        <div className="mt-4 p-4 grid grid-cols-2 gap-8">
          <div className="w-96 bg-white h-68 flex flex-col items-center p-4 rounded-lg">
            <TbWorld className="faq-icon" />
            <hr className="w-full mt-2 #eee" />
            <div className="h-full flex flex-col justify-between">
              <h3 className="text-center text-lg font-semibold mt-2">WhatSurv이란?</h3>
              <p className="h-[144px] text-justify">
                {' '}
                WhatSurv은 영어 인삿말인 What&apos;s up? 에서 영감받아 What + survey를 합친 단어 입니다.
                <br /> What&apos;s up?의 의미가 가벼운 인사인 것처럼 이 사이트가 사용자들에게 친근하고 편안하게 느껴지길
                바라는 의미가 내포되어 있습니다.
              </p>
            </div>
          </div>
          <div className="w-96 bg-white h-68 flex flex-col items-center p-4 rounded-lg">
            <PiHandWavingFill className="faq-icon" />
            <hr className="w-full mt-2 #eee" />
            <div className=" h-full flex flex-col justify-between">
              <h3 className="text-center text-lg font-semibold mt-2">사이트 소개</h3>
              <p className="text-justify">
                {' '}
                WhatSurv은 IT 업계에서 종사하는 관계자들이 사용자의 니즈를 간편하고 빠르게 수집할 수 있도록 돕는 사용자
                친화적인 설문조사 웹 사이트입니다. <br /> 우리의 목표는 사용자의 다양한 니즈와 의견을 체계적으로
                수집하여 기업들이 더 나은 제품과 서비스를 개발하는 데 도움을 주는 것입니다
              </p>
            </div>
          </div>
          <div className="w-96 bg-white h-68 flex flex-col items-center p-4 rounded-lg">
            <AiOutlineFileSearch className="faq-icon" />
            <hr className="w-full mt-2 #eee" />
            <div className="h-full flex flex-col justify-between">
              <h3 className="text-center text-lg font-semibold mt-2">다루는 주제</h3>
              <p className="text-justify">
                {' '}
                WhatSurv에서는 IT 관련 설문조사 뿐만 아니라, 누구나 쉽게 참여할 수 있는 다양한 주제의 설문조사를 다루고
                있습니다.
                <br /> 우리는 다양한 분야의 의견을 수렴하여 사회적, 경제적인 다양성을 존중하며, 그 결과를 기반으로
                혁신적인 솔루션을 창출하고자 합니다.
              </p>
            </div>
          </div>
          <div className="w-96 bg-white h-68 flex flex-col items-center p-4 rounded-lg">
            <MdSecurity className="faq-icon" />
            <hr className="w-full mt-2 #eee" />
            <div className="h-full flex flex-col justify-between">
              <h3 className="text-center text-lg font-semibold mt-2">가치</h3>
              <p className="h-[144px] text-justify">
                WhatSurv는 신뢰와 정직을 기반으로 하는 이미지를 중요하게 생각하고 있습니다. <br /> 우리는 사용자들의
                의견을 존중하며, 수집된 데이터를 안전하게 다루어 기업들과 사용자 모두에게 신뢰성 있는 결과물을
                제공하고자 합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="qna p-4 flex flex-col items-center">
        <h2 className="flex justify-start text-2xl font-bold">자주 묻는 질문 Q&A</h2>
        <div className="mt-4 p-4 flex flex-col w-[980px]">
          <div className="p-2 ">
            <h3 className="font-semibold text-lg">
              <span className="text-[#0051ff]">Q. </span>어떤 종류의 설문조사가 제공되나요?
            </h3>
            <p>
              <span className="text-[#ff0000]">A. </span>WhatSurv에서는 IT 관련 주제부터 다양한 분야의 설문조사까지
              다룹니다. 사용자들은 자신에게 관련된 주제에서 의견을 제공할 수 있습니다.
            </p>
          </div>
          <div className="mt-4 p-2 flex flex-col">
            <h3 className="font-semibold text-lg">
              <span className="text-[#0051ff]">Q. </span> 내 개인정보는 안전하게 보호되나요?
            </h3>
            <p>
              <span className="text-[#ff0000]">A. </span>사용자의 개인정보 보호는 우리의 최우선 과제입니다. 엄격한 보안
              및 개인정보 처리 정책을 준수하여 모든 정보를 안전하게 관리하고 있습니다.
            </p>
          </div>
          <div className="mt-4 p-2 flex flex-col">
            <h3 className="font-semibold text-lg">
              <span className="text-[#0051ff]">Q. </span> 참여한 설문조사 결과를 어떻게 활용하나요?
            </h3>
            <p>
              <span className="text-[#ff0000]">A. </span>사용자들의 참여는 기업들이 제품 및 서비스를 개선하는 데 도움이
              됩니다. 결과는 익명화되어 기업들에게 제시되며, 소비자 중심의 의사결정을 촉진합니다.
            </p>
          </div>
          <div className="mt-4 p-2 flex flex-col">
            <h3 className="font-semibold text-lg">
              <span className="text-[#0051ff]">Q. </span> 어떻게 설문조사에 참여할 수 있나요?
            </h3>
            <p>
              <span className="text-[#ff0000]">A. </span>WhatSurv는 쉽고 간편한 참여 방법을 제공합니다. 웹 사이트에
              가입하고 원하는 설문에 참여하여 의견을 공유할 수 있습니다.
            </p>
          </div>
          <div className="mt-4 p-2 flex flex-col">
            <h3 className="font-semibold text-lg">
              <span className="text-[#0051ff]">Q. </span> IT surv과 참여해 Surv의 차이는 무엇인가요?
            </h3>
            <p>
              <span className="text-[#ff0000]">A. </span>IT Surv에서는 IT 업계 종사자들이 참여하고 설문을 생성할 수
              있고, 참여해 Surv에서는 일반인을 대상으로 보다 폭넓고 가벼운 주제의 설문조사에 참여하고 생성할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
