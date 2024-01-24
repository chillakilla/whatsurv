'use client';
import {getUserPostsIT} from '@/app/api/firebaseApi';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
interface Post {
  id: string;
  title: string;
  content: string;
  deadlineDate: Date | null;
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
            console.log(doc);
            console.log(doc.id);
            return {
              id: doc.id,
              title: doc.title,
              content: doc.content,
              deadlineDate: doc.deadlineDate,
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
    </div>
  );
}
