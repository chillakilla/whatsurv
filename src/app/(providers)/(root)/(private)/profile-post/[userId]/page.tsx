'use client';
import {deletePost, deleteliteSurveyPostById} from '@/app/api/firebaseApi';
import {Button, Card, CardBody, Tab, Tabs} from '@nextui-org/react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {MoonLoader} from 'react-spinners';
import Swal from 'sweetalert2';
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
  const [userPostLite, setUserPostLite] = useState<PostLite[]>([]);
  const params = useParams<{userId: string}>();
  const userId = params.userId;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      Promise.all([getUserPostsIT(userId), getUserPostLite(userId)])
        .then(([postsIT, postsLite]) => {
          setPosts(postsIT);
          setUserPostLite(postsLite);
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
        <Tab title="내가 작성한 IT 서베이">
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
                          마감일 | {''}
                          {post.deadlineDate
                            ? post.deadlineDate.toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })
                            : 'No deadline'}
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
      </Tabs>
    </div>
  );
}
