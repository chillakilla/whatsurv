'use client';

import {addPost, fetchPosts} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import {useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';

export default function PostPage() {
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    likes: 0,
    category: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPost(formData);

      setFormData({
        title: '',
        content: '',
        imageUrl: '',
        likes: 0,
        category: '',
      });

      refetch();
    } catch (error) {
      console.error('에러', error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label>Title: </label>
        <input
          className="border-solid border-2  border-black"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <label>Content: </label>
        <textarea
          className="border-solid border-2  border-black"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
        />
        <label>ImageUrl: </label>
        {/* TODO: 파일 업로드도 추가해야할 듯 */}
        <input
          className="border-solid border-2  border-black"
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleInputChange}
        />
        <label>category: </label>
        <input
          className="border-solid border-2  border-black"
          type="text"
          name="category"
          value={formData.category}
          required
          onChange={handleInputChange}
        />
        <button type="submit" className="w-[50px] h-[50px] mt-[10px] border-solid border-2  border-black">
          Add
        </button>
      </form>
      {/* 로딩 & 에러 & 서버와의 통신 불량 유효성 검사에 대한 결과 창 */}
      {/* 윗 내용 + 게시글 맵 돌려서 뿌려주는 삼항연산자 */}
      {isLoading && <div>로딩 중...</div>}
      {isError && <div>로딩 중에 오류가 발생했습니다.</div>}
      {!posts || posts.length === 0 ? (
        <div>불러올 수 있는 게시글이 없습니다.</div>
      ) : (
        <div>
          {posts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <img src={post.imageUrl} alt="Post Image" />
              <p>Likes: {post.likes}</p>
              <p>Category: {post.category}</p>
              <p>CreatedAt: {post.createdAt.toDate().toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
