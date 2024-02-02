'use client';
import {getPosts, updateItPageLikedPostsSubcollection, updateLikesCount} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {useQuery} from '@tanstack/react-query';
import {collection, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import RenderPost from '../../../(public)/survey-it/_components/RenderPost';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SwiperCore from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export default function ItList() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<{[postId: string]: boolean}>({});
  const user = auth.currentUser;
  const userId = user?.uid;
  const {
    // data: posts,
    // isLoading,
    // isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  });
  const updateViewsCount = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const currentViews = postSnapshot.data().views || 0;
        await updateDoc(postRef, {
          views: currentViews + 1, // 'views' 카운트 증가
        });
      } else {
        console.error(`게시물 ID ${postId}에 해당하는 문서가 존재하지 않습니다.`);
      }
    } catch (error) {
      console.error('Views 카운트 업데이트 중 오류:', error);
    }
  };
  // 게시물 클릭을 처리하는 함수
  const clickPostHandler = (post: Post) => {
    setSelectedPost(post);
    updateViewsCount(post.id); // 'views' 카운트를 업데이트하는 함수 호출
  };

  // 게시물 찜 업데이트 함수 (광희)
  const clickLikedButtonHandler = async (postId: string) => {
    if (!user) {
      return;
    }
    if (userId) {
      try {
        // 좋아요 수 카운트 함수
        await updateLikesCount(postId, userId, likedPosts);

        // 사용자 문서 업데이트: 좋아하는 게시물의 ID를 업데이트하기
        await updateItPageLikedPostsSubcollection(userId, postId, !likedPosts[postId]);

        // likedPosts 상태 업데이트
        setLikedPosts(prevState => ({
          ...prevState,
          [postId]: !prevState[postId],
        }));
      } catch (error) {
        console.error('좋아요 수 업데이트 중 오류:', error);
      }
      refetch();
    }
  };

  // 좋아요 버튼 누른 게시물 가져오는 함수 (광희)
  const getLikedPosts = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const likedPostsRef = collection(userRef, 'itSurveyLikedPosts');
      const likedPostsSnapshot = await getDocs(likedPostsRef);

      const likedPosts: {[postId: string]: boolean} = {};
      likedPostsSnapshot.forEach(doc => {
        likedPosts[doc.id] = true;
      });

      setLikedPosts(likedPosts);
    } catch (error) {
      console.error('좋아하는 게시물을 가져오는 중 오류 발생:', error);
    }
  };

  // 좋아요 버튼 누른 게시물 화면에 적용시키는 함수 (광희)
  useEffect(() => {
    if (userId) {
      getLikedPosts(userId);
    }
  }, [userId]);

  SwiperCore.use([Navigation, Pagination]);
  const swiperRef = useRef<SwiperCore>();
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>로딩 중에 오류가 발생했습니다.</div>;
  }

  if (!posts) {
    return <div>불러올 수 있는 게시글이 없습니다.</div>;
  }

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">
          요즘 <span className="text-[#0051FF]">IT</span> Surv
        </h2>
        <Link href={`/survey-it`} className="text-lg font-semibold text-[#0051FF]">
          더보기
        </Link>
      </div>
      <Swiper
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
        slidesPerView={4}
        spaceBetween={20}
        loop={true}
        pagination={{
          clickable: true,
          el: null,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="popular-swiper"
      >
        {posts.map(post => {
          return (
            <SwiperSlide id="it-slide" key={post.id}>
              <RenderPost
                key={post.id}
                post={post}
                clickPostHandler={clickPostHandler}
                clickLikedButtonHandler={clickLikedButtonHandler}
                likedPosts={likedPosts}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
