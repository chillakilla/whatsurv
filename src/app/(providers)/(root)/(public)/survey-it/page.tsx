'use client';
import {getPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {useQuery} from '@tanstack/react-query';
import 'firebase/compat/firestore';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import Swal from 'sweetalert2';
import FloatingBtn from '../../(main)/_components/FloatingBtn';
import Popular from '../../(main)/_components/carousel/Popular';
import SortingPost from '../../(main)/_components/post/SortingPost';
import SearchBar from '../../(main)/searchForm/SearchBar';
import {Category, majorCategories} from '../../(private)/create-post/_components/categories';
import NormalRenderPost from './_components/NormalRenderPost';
import SearchRenderPost from './_components/SearchRenderPost';

export default function SurveyIt() {
  const [categories, setCategories] = useState<Category[]>(majorCategories);
  const [selectCategory, setSelectCategory] = useState<string>('전체');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<{[postId: string]: boolean}>({});
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const router = useRouter();
  const user = auth.currentUser;
  const {
    data: posts,
    isLoading,
    isError,
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
  const clickLikedButtonHandler = (postId: string) => {
    setLikedPosts(prev => {
      const updatedLikedPosts = {...prev};
      updatedLikedPosts[postId] = !updatedLikedPosts[postId];
      return updatedLikedPosts;
    });
  };

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
                <SearchRenderPost
                  key={post.id}
                  post={post}
                  clickPostHandler={clickPostHandler}
                  clickLikedButtonHandler={clickLikedButtonHandler}
                  likedPosts={likedPosts}
                />
              ))
            ) : (
              filteredPosts.map(post => (
                <NormalRenderPost
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
