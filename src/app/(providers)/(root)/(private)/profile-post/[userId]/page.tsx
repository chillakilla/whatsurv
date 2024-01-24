'use client';
import {Card, CardBody, Tab, Tabs} from '@nextui-org/react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {getUserPostLite, getUserPostsIT} from '../_components/getUserPost';
interface PostIT {
  id: string;
  title: string;
  content: string;
  deadlineDate: Date | null;
}
interface PostLite {
  id: string;
  title: string;
  content: string;
}

export default function ProfilePost() {
  const [posts, setPosts] = useState<PostIT[]>([]);
  const [userPostLite, setUserPostLite] = useState<PostLite[]>([]);
  const params = useParams<{userId: string}>();
  const userId = params.userId;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      Promise.all([getUserPostsIT(userId), getUserPostLite(userId)])
        .then(([postsIT, postsLite]) => {
          setPosts(postsIT);
          setUserPostLite(postsLite);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]);

  if (isLoading) {
    return <div>로딩 중......</div>;
  }

  return (
    <div className="max-w-[1400px] m-auto mt-[20px] ">
      <Tabs
        aria-label="서베이 Tab"
        size="lg"
        variant="underlined"
        classNames={{
          tabList: 'gap-6  border-b-0 font-bold  w-full mb-[15px] relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full bg-[#0051FF]',
          tab: 'max-w-fit px-0 h-12 text-xl px-2',
          tabContent: 'group-data-[selected=true]:text-[#0051FF]',
        }}
      >
        <Tab title="내가 작성한 IT 서베이">
          <Card className="bg-transparent border-0  rounded-none shadow-none">
            <CardBody>
              <ul>
                {posts.map(post => (
                  <li key={post.id} className="bg-white mb-[20px] px-[10px]  rounded-xl py-[20px] ">
                    <Link href={`/survey-it/${post.id}`} className="text-xl">
                      {post.title}
                      <p className="text-base">
                        마감일:
                        {post.deadlineDate
                          ? post.deadlineDate.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })
                          : 'No deadline'}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Tab>
        <Tab title="내가 작성한 참여했Surv">
          <Card>
            <CardBody>
              <ul>
                {userPostLite.map(post => (
                  <li key={post.id}>
                    <Link href="/survey-lite">{post.title}</Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
