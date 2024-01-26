import TypingAnimation from './_components/TypingAnimation';

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
        <div className="mt-4 p-4 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg ">WhatSurv 소개</h3>
            <p className="bg-white  h-28 p-4">
              WhatSurv은 IT 업계에서 종사하는 관계자들이 사용자의 니즈를 간편하고 빠르게 수집할 수 있도록 돕는 사용자
              친화적인 설문조사 웹 사이트입니다. <br /> 우리의 목표는 사용자의 다양한 니즈와 의견을 체계적으로 수집하여
              기업들이 더 나은 제품과 서비스를 개발하는 데 도움을 주는 것입니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg ">다루는 주제</h3>
            <p className="bg-white  h-28 p-4">
              WhatSurv에서는 IT 관련 설문조사 뿐만 아니라, 누구나 쉽게 참여할 수 있는 다양한 주제의 설문조사를 다루고
              있습니다.
              <br /> 우리는 다양한 분야의 의견을 수렴하여 사회적, 경제적인 다양성을 존중하며, 그 결과를 기반으로
              혁신적인 솔루션을 창출하고자 합니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg ">WhatSurv의 가치: 신뢰와 정직</h3>
            <p className="bg-white h-28 p-4">
              WhatSurv는 신뢰와 정직을 기반으로 하는 이미지를 중요하게 생각하고 있습니다. <br /> 우리는 사용자들의
              의견을 존중하며, 수집된 데이터를 안전하게 다루어 기업들과 사용자 모두에게 신뢰성 있는 결과물을 제공하고자
              합니다.
            </p>
          </div>
        </div>
      </div>
      <hr />
      <div className="question p-4  flex flex-col items-center">
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
              <span className="text-[#0051ff]">Q. </span> 어떤 가치를 얻을 수 있을까요?
            </h3>
            <p>
              <span className="text-[#ff0000]">A. </span>참여자들은 다양한 분야에서의 의견을 통해 사회적 영향력을 행사할
              수 있습니다. 또한, 우리는 참여자들에게 다양한 혜택과 인센티브를 제공하여 참여에 대한 감사를 표현하고
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
