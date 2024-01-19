import {useRouter} from 'next/navigation';
import React from 'react';

export type TabProps = {
  selectedTab: {
    name: string;
    to: string;
  };
  setSelectedTab: React.Dispatch<
    React.SetStateAction<{
      name: string;
      to: string;
    }>
  >;
};

// 3. Lite 클릭 시 /survey-lite 페이지로 이동한다. (같은 페이지의 경우 이동 X)
// 4. IT, Beauty, Medical 클릭 시 / 페이지로 이동한다. (같은 페이지의 경우 이동 X)
export default function Tab({selectedTab, setSelectedTab}: TabProps) {
  const router = useRouter();

  const clickTabHandler = (tab: {name: string; to: string}) => {
    // 페이지 이동을 기본으로 둠

    router.push(`${tab.to}?tab=${tab.name}`);
    setSelectedTab(tab);
  };

  return (
    <nav className=" hide-nav h-12 w-full border-b-1 bg-white">
      <ul className="flex items-center divide-x-2 text-center h-12 ml-[70px]">
        <li
          className={`w-24 ${selectedTab.name === 'IT' ? 'text-[#0051FF]' : ''}`}
          onClick={() => clickTabHandler({name: 'IT', to: '/'})}
        >
          IT
        </li>

        <li
          className={`w-24 ${selectedTab.name === 'Beauty' ? 'text-[#0051FF]' : ''}`}
          onClick={() => clickTabHandler({name: 'Beauty', to: '/'})}
        >
          BEAUTY
        </li>

        <li
          className={`w-24 ${selectedTab.name === 'Medical' ? 'text-[#0051FF]' : ''}`}
          onClick={() => clickTabHandler({name: 'Medical', to: '/'})}
        >
          MEDICAL
        </li>

        <li
          className={`w-24 ${selectedTab.name === 'LITE' ? 'text-[#0051FF]' : ''}`}
          onClick={() => clickTabHandler({name: 'LITE', to: '/survey-lite'})}
        >
          LITE
        </li>
      </ul>
    </nav>
  );
}
