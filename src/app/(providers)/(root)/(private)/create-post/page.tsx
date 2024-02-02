'use client';

import {addPost} from '@/app/api/firebaseApi';
import {FormData} from '@/app/api/typeFormData';
import {getAuth} from 'firebase/auth';
import 'firebase/compat/firestore';
import {Timestamp} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import PostForm from './_components/PostForm';
import Swal from 'sweetalert2';

export default function PostPage() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    content: '',
    category: '',
    ageGroup: '',
    sexType: '',
    researchType: '',
    researchTime: '',
    researchLocation: '',
    liked: 0,
    likes: false,
    createdAt: new Date(),
    deadline: '',
    nickname: user?.displayName || null,
    email: user?.email || null,
    views: 0,
    userId: user?.uid || '',
    updatedAt: new Date(),
    surveyData: [{question: '', options: ['매우 그렇다', '그렇다', '보통이다', '아니다', '매우 아니다']}],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const validateForm = () => {
    if (formData.title.trim() === '') {
      setIsError('Title is required.');
      return false;
    }
    if (formData.content.trim() === '') {
      setIsError('Content is required.');
      return false;
    }

    setIsError(null);
    return true;
  };

  useEffect(() => {
    const latestRoute = localStorage.getItem('latestRoute');
    if (latestRoute) {
      localStorage.removeItem('latestRoute');
      router.push(latestRoute);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    setIsFormChanged(true);
  };

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      // Display a warning message if validation fails
      Swal.fire({
        title: '경고!',
        text: '모든 필드를 작성해야 합니다.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    setIsSubmitting(true);

    Swal.fire({
      title: '확실합니까?',
      text: '한 번 제출하면, 게시글을 수정할 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '네, 제출합니다.',
      cancelButtonText: '취소',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const updatedFormData = {
            ...formData,
          };
          console.log('formData before saving:', formData); // Log the formData for debugging
          await addPost(updatedFormData);
          setFormData({
            ...formData,
            id: '',
            title: '',
            content: '',
            category: '',
            ageGroup: '',
            sexType: '',
            researchType: '',
            researchTime: '',
            researchLocation: '',
            deadline: '',
            createdAt: new Date(),
            likes: false,
            nickname: user?.displayName || null,
            surveyData: [{question: '', options: ['', '', '', '', '']}],
          });

          setIsRedirecting(true);
          setIsFormChanged(false);
          router.push('/');
        } catch (error) {
          console.error('Error adding post:', error);
          setIsError('Failed to add post. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  return (
    <div>
      {/* isRedirecting = 로딩 스피너 추가 */}
      {isRedirecting && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="loading-spinner-overlay animate-spin border-t-4 border-blue-500 rounded-full h-12 w-12"></div>
        </div>
      )}
      <div>
        <PostForm
          formData={formData}
          setFormData={setFormData}
          onInputChange={onInputChange}
          onCategoryChange={onCategoryChange}
          onSubmit={onSubmit}
          isFormChanged={isFormChanged}
        />
      </div>
    </div>
  );
}
