'use client';

import {addPost} from '@/app/api/firebaseApi';
import {FormData} from '@/app/api/typeFormData';
import {Editor} from '@toast-ui/react-editor';
import {getAuth} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {Timestamp} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import PostForm from './_components/PostForm';

export default function PostPage() {
  const editorRef = useRef<Editor>(null);
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
    likes: false,
    deadlineDate: null as firebase.firestore.Timestamp | null,
    createdAt: Timestamp.now(),
    nickname: user?.displayName || null,
    email: user?.email || null,
    views: 0,
    userId: user?.uid || '',
    updatedAt: Timestamp.now(),
    surveyData: [{question: '', options: ['매우 그렇다', '그렇다', '보통이다', '아니다', '매우 아니다']}],
  });
  const [selectedDeadline, setSelectedDeadline] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const latestRoute = localStorage.getItem('latestRoute');
    if (latestRoute) {
      localStorage.removeItem('latestRoute');
      router.push(latestRoute);
    }
  }, []);

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const dateValue = value ? new Date(value) : null;

    setSelectedDeadline(dateValue);

    setFormData(prevData => ({
      ...prevData,
      [name]: dateValue,
    }));
  };

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
    setIsSubmitting(true);

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
        deadlineDate: null as firebase.firestore.Timestamp | null,
        createdAt: Timestamp.now(),
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
          onDateChange={onDateChange}
          onCategoryChange={onCategoryChange}
          onSubmit={onSubmit}
          isFormChanged={isFormChanged}
        />
      </div>
    </div>
  );
}
