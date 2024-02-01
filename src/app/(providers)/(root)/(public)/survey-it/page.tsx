'use client';
import {getPosts, updateItPageLikedPostsSubcollection, updateLikesCount, updateViewsCount} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {useQuery} from '@tanstack/react-query';
import 'firebase/compat/firestore';
import {collection, doc, getDocs} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import FloatingBtn from '../../(main)/_components/FloatingBtn';
import Popular from '../../(main)/_components/carousel/Popular';
import SortingPost from '../../(main)/_components/post/SortingPost';
import SearchBar from '../../(main)/searchForm/SearchBar';
import {Category, majorCategories} from '../../(private)/create-post/_components/categories';
import RenderPost from './_components/RenderPost';

export default function SurveyIt() {
  const [categories, setCategories] = useState<Category[]>(majorCategories);
  const [selectCategory, setSelectCategory] = useState<string>('전체');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<{[postId: string]: boolean}>({});
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const router = useRouter();
  const user = auth.currentUser;
  const userId = user?.uid;

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  // 게시물 클릭을 처리하는 함수
  const clickPostHandler = (post: Post) => {
    //TODO: 이 부분 string 에 맞게끔 수정 필요
    if (post.deadlineDate) {
      Swal.fire({
        title: '해당 설문은 종료되었습니다.',
        text: '',
        icon: 'warning',

        showCancelButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: '닫기',
      }).then(async result => {
        if (result.isDismissed) {
          router.replace('/survey-it');
        }
      });
    } else {
      if (!user) {
        Swal.fire('로그인 회원만 이용 가능합니다.', '', 'warning');
        router.replace('/auth');
      } else {
        setSelectedPost(post);
        updateViewsCount(post.id);
      }
      // 'views' 카운트를 업데이트하는 함수 호출
    }
  };

  // 게시물 찜 업데이트 함수
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

  // 좋아요 버튼 누른 게시물 가져오는 함수
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

  // 좋아요 버튼 누른 게시물 화면에 적용시키는 함수
  useEffect(() => {
    if (userId) {
      getLikedPosts(userId);
    }
  }, [userId]);

  // 카테고리 선택 함수
  const clickCategoryHandler = (category: string) => {
    setSelectCategory(category);
  };

  return (
    <div className="flex-col items-center justify-center w-[88.5rem] m-auto mt-20">
      <SearchBar posts={posts || []} setSearchResults={setSearchResults} />
      <Popular />
      <div className="my-20">
        <div className="title-box flex-col items-center  mb-4">
          <SortingPost
            categories={categories}
            selectCategory={selectCategory}
            onCategorySelect={clickCategoryHandler}
            setFilteredPosts={setFilteredPosts}
          />
          <div className="flex">
            <h2 className="font-bold text-xl w-[140px]  ">{selectCategory}</h2>
          </div>
        </div>
        <div className="post-container grid grid-cols-4 gap-4">
          {searchResults.length > 0 || filteredPosts.length > 0 ? (
            searchResults.length > 0 ? (
              searchResults.map(post => (
                <RenderPost
                  key={post.id}
                  post={post}
                  clickPostHandler={clickPostHandler}
                  clickLikedButtonHandler={clickLikedButtonHandler}
                  likedPosts={likedPosts}
                />
              ))
            ) : (
              filteredPosts.map(post => (
                <RenderPost
                  key={post.id}
                  post={post}
                  clickPostHandler={clickPostHandler}
                  clickLikedButtonHandler={clickLikedButtonHandler}
                  likedPosts={likedPosts}
                />
              ))
            )
          ) : (
            <p>
              {searchResults.length === 0 || filteredPosts.length === 0
                ? '현재 등록된 게시물이 없습니다.'
                : '일치하는 게시물이 없습니다.'}
            </p>
          )}
        </div>
        <FloatingBtn />
      </div>
    </div>
  );
}
