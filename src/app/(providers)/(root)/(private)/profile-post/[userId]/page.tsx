'use client';
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
  const params = useParams<{userId: string}>();
  const userId = params.userId;
  const [userPostLite, setUserPostLite] = useState<PostLite[]>([]);

  useEffect(() => {
    if (userId) {
      getUserPostsIT(userId).then(data => {
        // 기존 게시글 데이터 설정
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
        // 새로운 게시글 데이터 설정
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

  return (
    <div>
      <h1>내가 작성한 IT 서베이</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/survey-it/${post.id}`}>
              {post.title}
              <p>
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

      <h1>내가 작성한 참여했Surv</h1>
      <ul>
        {userPostLite.map(post => (
          <li key={post.id}>
            <Link href={`/litesurveyposts/${post.id}`}>
              {post.title}
              {/* 필요한 경우 마감일 등 추가 정보 렌더링 */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
