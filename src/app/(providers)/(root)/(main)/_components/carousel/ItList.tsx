'use client';
import {getPosts, updateItPageLikedPostsSubcollection, updateLikesCount} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {auth, db} from '@/firebase';
import {useQuery} from '@tanstack/react-query';
import {collection, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore';
import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {useRouter} from 'next/navigation';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import {IoPeopleSharp} from 'react-icons/io5';
import {Tooltip} from '@nextui-org/react';
import {BsFillQuestionCircleFill} from 'react-icons/bs';
import Swal from 'sweetalert2';
import {MoonLoader} from 'react-spinners';

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
  const router = useRouter();

  const {refetch} = useQuery<Post[]>({
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
    router.push(`/survey-it/${post.id}`);
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

  // 이미 참여한 설문 -> 참여하기 버튼 비활성화 하기 (보류)
  const disabledButtonHandler = () => {};

  // 결과로 넘어가는 버튼
  const moveResultHandler = (post: Post) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'warning',
      title: '구현 중인 기능입니다. 죄송합니다!',
    });
  };

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
    return (
      <div className="flex justify-center flex-wrap items-center overflow-y-hidden mt-[300px]">
        <MoonLoader color="#0051FF" size={100} />
        <p className="text-[#0051FF] w-full text-center mt-[30px]">잠시만 기다려 주세요..</p>
      </div>
    );
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
              <div className={`h-72 border-2 border-[#e1e1e1] flex flex-col justify-between rounded-xl p-4 bg-white `}>
                <div className="category-box flex justify-between items-center ">
                  <div className="flex gap-2">
                    <div className="bg-[#0051ff] text-[#D6FF00] h-[25px] w-[75px] p-1 text-center rounded-full font-semibold text-xs">
                      {post.category}
                    </div>
                    <div
                      className={`bg-[#D6FF00] text-black w-14 p-1 text-center rounded-full font-semibold text-xs ${
                        post.views >= 40 ? 'block' : 'hidden'
                      }`}
                    >
                      {post.views >= 40 ? 'HOT🔥' : ''}
                    </div>
                  </div>
                  <button
                    className="like-button w-[20px] h-[20px] flex justify-evenly items-center text-[#0051FF] bg-transparent"
                    onClick={() => clickLikedButtonHandler(post.id)}
                  >
                    {likedPosts[post.id] ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-[#666]">등록일 {post.createdAt.toLocaleDateString()}</p>
                  <h3 className="font-semibold text-lg text-ellipsis overflow-hidden  line-clamp-1 mb-2">
                    {post.title}
                  </h3>
                </div>
                <div className="survey-method flex flex-col gap-2 bg-slate-100 h-[70px] p-2  ">
                  <div className="flex text-sm justify-start grid grid-cols-2 ">
                    <p>
                      <span className="text-[#666]">소요 시간</span> &nbsp; {post.researchTime}
                    </p>
                    <p>
                      <span className="text-[#666]">설문 방식</span> &nbsp; {post.researchType}
                    </p>
                  </div>
                  <div className="survey-method flex text-sm justify-start grid grid-cols-2">
                    <p>
                      <span className="text-[#666]">참여 연령</span> &nbsp; {post.ageGroup}
                    </p>
                    <p>
                      <span className="text-[#666]">참여 대상</span> &nbsp; {post.sexType}
                    </p>
                  </div>
                </div>
                <div className=" flex justify-between items-center">
                  <div className="flex items-center w-full justify-between">
                    <p className="flex items-center gap-2 text-sm text-black">
                      종료일 {post.deadline ? post.deadline : '--'}
                    </p>
                    <div className="goal flex  gap-2 text-[#818490]">
                      <Tooltip
                        content={`설문 목적 : ${post.content}`}
                        className="line-clamp-1 text-wrap"
                        placement="left"
                      >
                        <button>
                          <BsFillQuestionCircleFill className="question" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div className=" h-[40px] flex justify-between items-center ">
                  <div className="flex gap-2">
                    <button
                      className="w-[100px] h-[32px] border-1 border-[#0051ff] hover:bg-[#0051ff] hover:text-white text-sm rounded-lg "
                      onClick={() => clickPostHandler(post)}
                    >
                      참여하기
                    </button>

                    <button
                      className="w-[100px] h-[32px] border-1 border-[#ddd]  hover:bg-black hover:text-white text-sm rounded-lg "
                      onClick={() => moveResultHandler(post)}
                    >
                      결과보기
                    </button>
                  </div>
                  <div className="viewer flex  gap-2 text-[#818490]">
                    <IoPeopleSharp />
                    {post.views}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
