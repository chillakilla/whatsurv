import Link from 'next/link';
import {usePathname} from 'next/navigation';

export default function Tab() {
  const pathname = usePathname();
  const tabData = [
    {
      id: 'It',
      name: 'IT',
      path: '/survey-it',
    },
    {
      id: 'Lite',
      name: '참여해Surv',
      path: '/survey-lite',
    },
    {
      id: 'Faq',
      name: 'FAQ',
      path: '/faq',
    },
  ];
  // 탭 클릭 후 페이지 이동
  // 현재 페이지가 각각의 탭의 href와 같다면 해당 link 태그의 글자에 파란색 포인트 주기
  return (
    <nav className=" hide-nav h-12 w-full border-t-1 bg-white select-none ">
      <ul className="flex items-center divide-x-2 text-center h-12 m-auto max-w-[1450px]">
        {tabData.map(tab => {
          return (
            <Link href={tab.path} key={tab.id} className={`${tab.path === pathname ? 'text-[#0051FF]' : ''} w-28`}>
              {tab.name}
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}
