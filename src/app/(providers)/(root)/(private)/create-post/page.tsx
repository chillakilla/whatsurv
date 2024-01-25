'use client';

import {addPost, uploadImageToStorage} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';
import React, {useState, useRef, useEffect} from 'react';
import PostForm from './_components/PostForm';
import ToastEditor from './_components/ToastEditor';
import {Editor} from '@toast-ui/react-editor';
import {getAuth} from 'firebase/auth';
import {FormData} from '@/app/api/typeFormData';
import firebase from 'firebase/compat/app';
import {db} from '@/firebase';
import {Timestamp} from 'firebase/firestore';
import 'firebase/compat/firestore';
import {useRouter} from 'next/navigation';

export default function PostPage() {
  const editorRef = useRef<Editor>(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    content: '',
    imageUrl: '',
    category: '',
    ageGroup: '',
    sexType: '',
    researchType: '',
    researchTime: '',
    researchLocation: '',
    deadlineDate: null as firebase.firestore.Timestamp | null,
    createdAt: Timestamp.now(),
    rewards: 0,
    email: user?.email,
    nickname: user?.displayName,
    questions: [{question: '', options: [''], selectedOption: ''}],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const ImgFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0] || null;
    if (imgFile) {
      setSelectedFile(imgFile);

      const reader = new FileReader();
      reader.onload = e => {
        const imageDataUrl = e.target?.result as string;
        setPreviewImage(imageDataUrl);
      };
      reader.readAsDataURL(imgFile);
    }
  };

  const SubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SubmitHandler called');

    try {
      let imageUrl = formData.imageUrl;

      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
      }

      const updatedFormData: Post = {
        id: formData.id,
        title: formData.title,
        content: formData.content,
        imageUrl: imageUrl,
        category: formData.category,
        sexType: formData.sexType,
        ageGroup: formData.ageGroup,
        researchType: formData.researchType,
        researchTime: formData.researchTime,
        researchLocation: formData.researchLocation,
        userId: user?.uid,
        email: user?.email ?? null,
        nickname: user?.displayName || undefined,
        deadlineDate: selectedDeadline ? firebase.firestore.Timestamp.fromDate(selectedDeadline) : null,
        rewards: formData.rewards,
        createdAt: Timestamp.now(),
        likes: 0,
        views: 0,
        updatedAt: new Date(),
        questions: formData.questions,
      };
      await addPost(updatedFormData);

      setSelectedFile(null);
      setPreviewImage(null);

      setFormData({
        id: '',
        title: '',
        content: '',
        imageUrl: '',
        category: '',
        ageGroup: '',
        sexType: '',
        researchType: '',
        researchTime: '',
        researchLocation: '',
        deadlineDate: null,
        createdAt: Timestamp.now(),
        rewards: 0,
        questions: [],
      });
      setIsRedirecting(true);
      alert('등록되었습니다.');
      // 등록 성공 시, 메인으로 이동.
      router.push('/');
      const currentUserRoute = window.location.pathname;
      localStorage.setItem('latestRoute', currentUserRoute);
    } catch (error) {
      console.error('에러', error);
      setIsError('게시글을 등록하는 중에 오류가 발생했습니다.');
    } finally {
      setIsRedirecting(false);
      setIsLoading(false);
    }
  };

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
    const {name, value} = e.target as HTMLInputElement;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
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
          onSubmit={SubmitHandler}
          onDateChange={onDateChange}
          onImgFileChange={ImgFileChangeHandler}
          previewImage={previewImage}
          onCategoryChange={onCategoryChange}
        />
      </div>
    </div>
  );
}
