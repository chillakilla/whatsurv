'use client';

import {deletePost} from '@/app/api/firebaseApi';
import {deleteliteSurveyPostById} from '@/app/api/litepagefirbaseApi';
import {Button, Card, CardBody, Tab, Tabs} from '@nextui-org/react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {MoonLoader} from 'react-spinners';
import Swal from 'sweetalert2';
import {
  deleteLikedPostIT,
  deleteLikedPostsLite,
  getLikedPostsIT,
  getLikedPostsLite,
  getUserPostLite,
  getUserPostsIT,
} from '../_components/getUserPost';
interface PostIT {
  id: string;
  title: string;
  content: string;
  deadlineDate?: string;
}
interface PostLite {
  id: string;
  title: string;
  content: string;
}

export default function ProfilePost() {
  const [posts, setPosts] = useState<PostIT[]>([]);
  const [userPostLite, setUserPostLite] = useState<PostLite[]>([]);
  const [likedLitePosts, setLikedLitePosts] = useState<PostLite[]>([]);
  const [likedITPosts, setLikedITPosts] = useState<PostIT[]>([]);

  const params = useParams<{userId: string}>();
  const userId = params.userId;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      Promise.all([getUserPostsIT(userId), getUserPostLite(userId), getLikedPostsLite(userId), getLikedPostsIT(userId)])
        .then(([postsIT, postsLite, likedLitePostsData, likedITPostsData]) => {
          setPosts(postsIT);
          setUserPostLite(postsLite);
          setLikedLitePosts(likedLitePostsData);
          setLikedITPosts(likedITPostsData);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center flex-wrap items-center overflow-y-hidden mt-[300px]">
        <MoonLoader color="#0051FF" size={100} />
        <p className="text-[#0051FF] w-full text-center mt-[30px]">잠시만 기다려 주세요..</p>
      </div>
    );
  }

  // Lite 게시글 삭제 핸들러
  const clickDeleteLiteHandler = async (postId: string) => {
    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      try {
        await deleteliteSurveyPostById(postId);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        setUserPostLite(prevPosts => prevPosts.filter(post => post.id !== postId));

        Swal.fire({
          title: '삭제되었습니다.',
          confirmButtonText: '확인',
          icon: 'success',
        });
      } catch (error) {
        console.error('Failed to delete post: ', error);
      }
    }
  };
  // IT 게시글 삭제 핸들러
  const clickDeleteITHandler = async (postId: string) => {
    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      try {
        await deletePost(postId);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        setUserPostLite(prevPosts => prevPosts.filter(post => post.id !== postId));

        Swal.fire({
          title: '삭제되었습니다.',
          confirmButtonText: '확인',
          icon: 'success',
        });
      } catch (error) {
        console.error('Failed to delete post: ', error);
      }
    }
  };

  // 좋아요한 게시글 삭제 핸들러
  const clickDeleteLikedPostLiteHandler = async (postId: string) => {
    const result = await Swal.fire({
      title: '좋아요를 해제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      try {
        await deleteLikedPostsLite(userId, postId); // 좋아요한 게시글 삭제 함수 호출
        setLikedLitePosts(prevPosts => prevPosts.filter(post => post.id !== postId)); // UI 업데이트

        Swal.fire({
          title: '좋아요가 해제되었습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#3085d6',
          icon: 'success',
        });
      } catch (error) {
        console.error('좋아요한 게시글 삭제 실패: ', error);
        Swal.fire({
          title: '좋아요 해제에 실패했습니다.',
          text: '다시 시도해 주세요.',
          icon: 'error',
        });
      }
    }
  };
  // 좋아요한 게시글 삭제 핸들러
  const clickDeleteLikedPostITHandler = async (postId: string) => {
    const result = await Swal.fire({
      title: '좋아요를 해제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed) {
      try {
        await deleteLikedPostIT(userId, postId); // 좋아요한 게시글 삭제 함수 호출
        setLikedITPosts(prevPosts => prevPosts.filter(post => post.id !== postId)); // UI 업데이트

        Swal.fire({
          title: '좋아요가 해제되었습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#3085d6',
          icon: 'success',
        });
      } catch (error) {
        console.error('좋아요한 게시글 삭제 실패: ', error);
        Swal.fire({
          title: '좋아요 해제에 실패했습니다.',
          text: '다시 시도해 주세요.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="max-w-[1400px] m-auto mt-[20px] select-none ">
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
        <Tab title="내가 작성한 IT Surv">
          <Card className="bg-transparent border-0  rounded-none shadow-none">
            <CardBody>
              {posts.length > 0 ? (
                <ul
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 auto
                "
                >
                  {posts.map(post => (
                    <li
                      key={post.id}
                      className="relative bg-white mb-[20px] w-[300px]  px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] "
                    >
                      <Link href={`/survey-it/${post.id}`} className="text-xl">
                        <p className="text-sm">
                          종료일 | {''}
                          {post.deadlineDate || 'No deadline'}
                        </p>
                        <p className="py-[8px] h-[69px] text-ellipsis overflow-hidden  line-clamp-2">{post.title}</p>
                      </Link>
                      <hr />
                      <Button
                        variant="ghost"
                        size="sm"
                        color="danger"
                        className="my-[10px] float-right absolute bottom-[6.5px] right-[10px]"
                        onClick={() => clickDeleteITHandler(post.id)}
                      >
                        삭제
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="relative bg-white mb-[20px] w-[300px] text-lg px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] ">
                  작성한 글이 없습니다.
                </p>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab title="내가 작성한 참여했Surv">
          <Card className="bg-transparent border-0  rounded-none shadow-none">
            <CardBody>
              {userPostLite.length > 0 ? (
                <ul
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 auto
                "
                >
                  {userPostLite.map(post => (
                    <li
                      key={post.id}
                      className="relative bg-white mb-[20px] w-[300px]  px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] "
                    >
                      <Link href="/survey-lite" className="text-xl">
                        <p className="py-[8px] h-[69px] text-ellipsis overflow-hidden  line-clamp-2">{post.title}</p>
                      </Link>
                      <hr />
                      <Button
                        variant="ghost"
                        size="sm"
                        color="danger"
                        className="my-[10px] float-right absolute bottom-[6.5px] right-[10px]"
                        onClick={() => clickDeleteLiteHandler(post.id)}
                      >
                        삭제
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="relative bg-white mb-[20px] w-[300px] text-lg px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] ">
                  작성한 글이 없습니다.
                </p>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab title="내가 좋아요한 IT Surv">
          <Card className="bg-transparent border-0  rounded-none shadow-none">
            <CardBody>
              {likedITPosts.length > 0 ? (
                <ul
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 auto
                "
                >
                  {likedITPosts.map(post => (
                    <li
                      key={post.id}
                      className="relative bg-white mb-[20px] w-[300px]  px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] "
                    >
                      <Link href={`/survey-it/${post.id}`} className="text-xl">
                        <p className="text-sm">
                          종료일 | {''}
                          {post.deadlineDate ? post.deadlineDate : 'No deadline'}
                        </p>
                        <p className="py-[8px] h-[69px] text-ellipsis overflow-hidden  line-clamp-2">{post.title}</p>
                      </Link>
                      <hr />
                      <Button
                        variant="ghost"
                        size="sm"
                        color="danger"
                        className="my-[10px] float-right absolute bottom-[6.5px] right-[10px]"
                        onClick={() => clickDeleteLikedPostITHandler(post.id)}
                      >
                        삭제
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="relative bg-white mb-[20px] w-[300px] text-lg px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] ">
                  좋아요한 글이 없습니다.
                </p>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab title="내가 좋아요한 참여했Surv">
          <Card className="bg-transparent border-0  rounded-none shadow-none">
            <CardBody>
              {likedLitePosts.length > 0 ? (
                <ul
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 auto
                "
                >
                  {likedLitePosts.map(post => (
                    <li
                      key={post.id}
                      className="relative bg-white mb-[20px] w-[300px]  px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] "
                    >
                      <Link href="/survey-lite" className="text-xl">
                        <p className="py-[8px] h-[69px] text-ellipsis overflow-hidden  line-clamp-2">{post.title}</p>
                      </Link>
                      <hr />
                      <Button
                        variant="ghost"
                        size="sm"
                        color="danger"
                        className="my-[10px] float-right absolute bottom-[6.5px] right-[10px]"
                        onClick={() => clickDeleteLikedPostLiteHandler(post.id)}
                      >
                        삭제
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="relative bg-white mb-[20px] w-[300px] text-lg px-[20px] h-[180px] rounded-xl py-[20px] border-2 border-[#0051FF80] ">
                  좋아요한 글이 없습니다.
                </p>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
