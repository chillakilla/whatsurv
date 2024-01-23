import React, {useEffect, useState} from 'react';
import {Button} from '@nextui-org/react';
import {LuPencilLine} from 'react-icons/lu';
import {auth} from '@/firebase';
import {getAuth, onAuthStateChanged, User} from 'firebase/auth';

export default function FloatingBtn() {
  const [user, setUser] = useState<User | null>(null); // Use User from the auth module

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  // 로그인된 유저 => /create-post 이동
  // 비로그인 유저 => 경고와 함께 /auth 로 이동
  const writeButtonHandler = () => {
    if (user) {
      window.location.href = '/create-post';
    } else {
      window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/auth';
    }
  };

  return (
    <div className="flex justify-end sticky bottom-10 z-99">
      <Button
        isIconOnly
        aria-label="write-post"
        className="w-[50px] h-[50px] rounded-full text-lg text-[#0051FF] bg-white shadow-md shadow-[#888]"
        onClick={writeButtonHandler}
      >
        <LuPencilLine />
      </Button>
    </div>
  );
}
