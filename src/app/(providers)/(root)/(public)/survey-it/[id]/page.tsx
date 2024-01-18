'use client';
import {getPostById} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import {useParams} from 'next/navigation';
import {FaRegHeart} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import Image from 'next/image';

export default function SurveyItDetailPage() {
  const {id} = useParams();

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post | null, Error>({
    queryKey: ['post', id],
    queryFn: () => getPostById(id as string),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching post data</div>;
  }

  const isValidUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  return (
    <div className="container h-[900px] w-[88.5rem] m-auto mt-10 border-1 border-[#C1C5CC] bg-white p-4">
      <div className="condition-box w-full h-52 bg-gray-200 grid grid-cols-4 items-center p-4">
        <div className="category-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">카테고리</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.category}
          </p>
        </div>
        <div className="age-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">연령</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.ageGroup}
          </p>
        </div>
        <div className="gender-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">성별</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.sexType}
          </p>
        </div>
        <div className="age-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">소요 시간</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.researchTime}
          </p>
        </div>
        <div className="process-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">진행방식</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.researchLocation}
          </p>
        </div>
        <div className="type-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">유형</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.researchType}
          </p>
        </div>
        <div className="type-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">리워드</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.rewards}
          </p>
        </div>
        <div className="deadline-box flex gap-2 justify-center items-center">
          <p className="text-sm font-semibold">마감일</p>
          <p className="border-1 border-[#C1C5CC] bg-white w-32 h-[35px] rounded-xl text-sm p-2 text-center">
            {post?.deadlineDate
              ? post?.deadlineDate.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
              : '2099.12.31'}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center border-1 border-[#C1C5CC] mt-4 p-2">
        <div className=" profile flex gap-2 items-center">
          <FaRegCircleUser />
          <p>작성자 닉네임 자리</p>
        </div>
        <p className="text-xs text-[#666]">
          작성일 |{' '}
          {post?.createdAt
            ? post?.createdAt.toLocaleString('ko-KR', {year: 'numeric', month: '2-digit', day: '2-digit'})
            : '비밀'}
        </p>
      </div>
      <div className="content-box border-1 border-[#C1C5CC] mt-4 p-4 flex gap-8 h-[500px]">
        <div className="img-box w-[420px] h-full">
          {post?.imageUrl && isValidUrl(post?.imageUrl) ? (
            <Image src={post.imageUrl} alt="survey-img" width={420} height={200} className="border-1 border-[#eee]" />
          ) : (
            <Image
              src="http://www.fifatown.co.kr/upfile/product/no_image.gif"
              alt="survey-img"
              width={420}
              height={200}
              className="alternative-img"
            />
          )}
        </div>
        <div className="w-3/4">
          <h1 className="text-xl font-bold border-b-1 border-[#d2d7e0]">{post?.title}</h1>
          <p className="h-[400px] mt-4">{post?.content}</p>
          <div className="flex items-center justify-end">
            <button className="like-button text-[#0051FF] bg-transparent">
              <FaRegHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
