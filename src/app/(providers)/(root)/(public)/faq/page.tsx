'use client';
import {Accordion, AccordionItem} from '@nextui-org/react';
export default function FaqPage() {
  const whatSurv = [
    {
      title: '사이트 소개',
      content: `WhatSurv은 IT 업계에서 종사하는 관계자들이 사용자의 니즈를 간편하고 빠르게 수집할 수 있도록 돕는 사용자 친화적인 설문조사 웹 사이트입니다.
       우리의 목표는 사용자의 다양한 니즈와 의견을 체계적으로 수집하여 기업들이 더 나은 제품과 서비스를 개발하는 데 도움을 주는 것입니다.`,
    },
    {
      title: '다루는 주제',
      content: `WhatSurv에서는 IT 관련 설문조사 뿐만 아니라, 누구나 쉽게 참여할 수 있는 다양한 주제의 설문조사를 다루고 있습니다.
      우리는 다양한 분야의 의견을 수렴하여 사회적, 경제적인 다양성을 존중하며, 그 결과를 기반으로 혁신적인 솔루션을 창출하고자 합니다.`,
    },
    {
      title: '가치',
      content: `WhatSurv는 신뢰와 정직을 기반으로 하는 이미지를 중요하게 생각하고 있습니다.
    우리는 사용자들의 의견을 존중하며, 수집된 데이터를 안전하게 다루어 기업들과 사용자 모두에게 신뢰성 있는 결과물을 제공하고자 합니다.`,
    },
  ];
  const faqContext = [
    {
      question: '어떤 종류의 설문조사가 제공되나요?',
      answer:
        'WhatSurv에서는 IT 관련 주제부터 다양한 분야의 설문조사까지 다룹니다. 사용자들은 자신에게 관련된 주제에서 의견을 제공할 수 있습니다.',
    },
    {
      question: '내 개인정보는 안전하게 보호되나요?',
      answer:
        '사용자의 개인정보 보호는 우리의 최우선 과제입니다. 엄격한 보안 및 개인정보 처리 정책을 준수하여 모든 정보를 안전하게 관리하고 있습니다.',
    },
    {
      question: '참여한 설문조사 결과를 어떻게 활용하나요?',
      answer:
        '사용자들의 참여는 기업들이 제품 및 서비스를 개선하는 데 도움이 됩니다. 결과는 익명화되어 기업들에게 제시되며, 소비자 중심의 의사결정을 촉진합니다.',
    },
    {
      question: '어떻게 설문조사에 참여할 수 있나요?',
      answer:
        'WhatSurv는 쉽고 간편한 참여 방법을 제공합니다. 웹 사이트에 가입하고 원하는 설문에 참여하여 의견을 공유할 수 있습니다. 더 자세한 설명은 이용가이드 페이지를 이용해주시길 바랍니다.',
    },
    {
      question: 'IT surv과 참여해 Surv의 차이는 무엇인가요?',
      answer:
        'IT Surv에서는 IT 업계 종사자들이 참여하고 설문을 생성할 수 있고, 참여해 Surv에서는 일반인을 대상으로 보다 폭넓고 가벼운 주제의 설문조사에 참여하고 생성할 수 있습니다.',
    },
  ];

  return (
    <div className="flex-col items-center justify-center w-[88.5rem] m-auto mt-10">
      <div className="about p-4 mb-20 flex flex-col items-center">
        <h1 className="text-3xl font-semibold">
          About.<span className="text-[#0051ff]">WhatSurv</span>
        </h1>
        <div className="my-10">
          <div className="w-full flex gap-8">
            {whatSurv.map(surv => {
              return (
                <div className=" h-full flex flex-col justify-between shadow-lg shadow-[#6997fa]" key={surv.title}>
                  <h3 className="w-96 bg-[#0051ff] p-4 text-white text-lg font-semibold text-center">{surv.title}</h3>
                  <p className="w-96 h-[200px] p-4 text-justify bg-white border-2 border-[#eee]">{surv.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <hr />
      <div className="qna p-4 flex flex-col items-center">
        <h2 className="flex justify-start text-3xl font-bold text-[#0051ff]">FAQ</h2>
        <div className=" p-4 flex flex-col gap-8 w-[1220px]">
          {faqContext.map(text => {
            return (
              <Accordion key={text.question} fullWidth>
                <AccordionItem key="1" aria-label="Accordion 1" title={` Q. ${text.question}`}>
                  {` A. ${text.answer}`}
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
}
