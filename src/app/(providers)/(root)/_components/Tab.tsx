import React from 'react';

export type TabProps = {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

export default function Tab({selectedTab, setSelectedTab}: TabProps) {
  const clickTabHandler = (tab: string) => {
    setSelectedTab(tab);
  };
  return (
    <nav className=" hide-nav h-12 w-full border-b-1 bg-white">
      <ul className="flex items-center divide-x-2 text-center h-12 ml-[70px]">
        <li className={`w-24 ${selectedTab === 'IT' ? 'text-[#0051FF]' : ''}`} onClick={() => clickTabHandler('IT')}>
          IT
        </li>

        <li
          className={`w-24 ${selectedTab === 'BEAUTY' ? 'text-[#0051FF]' : ''}`}
          onClick={() => clickTabHandler('BEAUTY')}
        >
          BEAUTY
        </li>

        <li
          className={`w-24 ${selectedTab === 'MEDICAL' ? 'text-[#0051FF]' : ''}`}
          onClick={() => clickTabHandler('MEDICAL')}
        >
          MEDICAL
        </li>

        <li
          className={`w-24 ${selectedTab === 'LITE' ? 'text-[#0051FF]' : ''}`}
          onClick={() => clickTabHandler('MEDICAL')}
        >
          LITE
        </li>
      </ul>
    </nav>
  );
}
