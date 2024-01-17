'use client';

import {getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

export default function PostDetailPage() {
  const router = useRouter();
  const {postId} = router.query;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        if (postId && typeof postId === 'string') {
          const postData = await getPostById(postId);
          setPost(postData);
        }
      } catch (error) {
        console.error('게시글을 불러오는 중 오류가 발생했습니다.', error);
      }
    };
    fetchSinglePost();
  }, [postId]);

  return (
    <div>
      <div>
        <h2>{post?.title}</h2>
      </div>
      <div>이곳에 게시글 작성한 유저의 정보</div>
      <p>{post?.content}</p>
    </div>
  );
}
