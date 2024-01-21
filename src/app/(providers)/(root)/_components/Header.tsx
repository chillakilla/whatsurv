'use client';

import {auth} from '@/firebase';
import {Button} from '@nextui-org/react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/auth');
  };

  return (
    <header>
      <section className="flex justify-between items-center border-b-1 bg-white p-2">
        <div className="flex items-center justify-center w-80">
          <Link href="/">
            <h1 className="font-bold text-xl">What Surv?</h1>
          </Link>
        </div>
        <div className="w-80 flex justify-center gap-4 p-2">
          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" color="primary" className="  font-bold ">
                  프로필 설정
                </Button>
              </Link>
              <Button variant="ghost" color="danger" onClick={handleLogout} className=" font-bold">
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/join">
                <Button color="success" variant="ghost" className="font-bold">
                  회원가입
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="ghost" color="primary" className="font-bold">
                  로그인
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>
    </header>
  );
}
