'use client';

import {Post} from '@/app/api/typePost';
import {useEffect, useState} from 'react';
import LiteSurveyCreateModal from '../../(main)/_components/LiteSurveyCreateModal';
import Modal from '../../(main)/_components/Modal';

const getPosts = async () => {
  const response = await fetch('https://example.com/api/liteSurveyPosts');
  const data = await response.json();

  return data;
};

const SurveyLitePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [liteSurveyPosts, setLiteSurveyPosts] = useState<Post[]>([]);

  const onClickModalOpen = () => {
    setIsModalOpen(true);
  };

  const onClickCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 'getPosts' 함수를 호출하여 Firebase에서 데이터를 가져옴
        const posts = await getPosts();
        setLiteSurveyPosts(posts);
      } catch (error) {
        console.error('Error fetching survey posts: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <button onClick={onClickCreateModalOpen}>게시물 작성</button>
      {isCreateModalOpen && <LiteSurveyCreateModal onCloseModal={() => setIsCreateModalOpen(false)} />}
      <button onClick={onClickModalOpen}>모달창 열기</button>
      {isModalOpen && <Modal onCloseModal={() => setIsModalOpen(false)} />}
      {liteSurveyPosts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <div>{post.content}</div>
        </div>
      ))}
    </>
  );
};

export default SurveyLitePage;
