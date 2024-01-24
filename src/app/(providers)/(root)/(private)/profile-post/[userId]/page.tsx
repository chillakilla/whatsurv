'use client';
import {Button} from '@nextui-org/react';
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

type Tab = 'IT' | 'Lite';

export default function ProfilePost() {
  const [posts, setPosts] = useState<PostIT[]>([]);
  const [userPostLite, setUserPostLite] = useState<PostLite[]>([]);
  const params = useParams<{userId: string}>();
  const userId = params.userId;

  //탭 기능 관련 상태
  const [currentTab, setCurrentTab] = useState('IT');

  useEffect(() => {
    if (userId) {
      getUserPostsIT(userId).then(data => {
        setPosts(
          data.map(doc => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            deadlineDate: doc.deadlineDate,
          })),
        );
      });

      getUserPostLite(userId).then(data => {
        setUserPostLite(
          data.map(doc => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
          })),
        );
      });
    }
  }, [userId]);

  // 탭 변경 핸들러
  const clickUserPostTabHandler = (tabName: Tab) => {
    setCurrentTab(tabName);
  };

  return (
    <div>
      <Button onClick={() => clickUserPostTabHandler('IT')}>내가 작성한 IT 서베이</Button>
      <Button onClick={() => clickUserPostTabHandler('Lite')}>내가 작성한 참여했Surv</Button>

      {currentTab === 'IT' && (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link href={`/survey-it/${post.id}`}>
                {post.title}
                <p>
                  마감일:{' '}
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
      )}

      {currentTab === 'Lite' && (
        <ul>
          {userPostLite.map(post => (
            <li key={post.id}>
              <Link href="/survey-lite">{post.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
