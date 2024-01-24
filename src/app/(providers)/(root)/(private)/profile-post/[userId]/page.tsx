'use client';
import {getUserPostsIT} from '@/app/api/firebaseApi';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
interface Post {
  id: string;
  title: string;
  content: string;
}

export default function ProfilePost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const params = useParams<{userId: string}>();
  const userId = params.userId;

  useEffect(() => {
    if (userId) {
      getUserPostsIT(userId).then(data => {
        setPosts(
          data.map(doc => {
            console.log(doc.id); // 여기서 각 게시글의 id를 콘솔에 로그합니다.
            return {
              id: doc.id,
              title: doc.title,
              content: doc.content,
            };
          }),
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
            <Link href={`/survey-it/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
