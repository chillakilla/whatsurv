'use client';

import {auth} from '@/firebase';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@nextui-org/react';
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
      <section className="w-[1400px] flex justify-between items-center m-auto ">
        <div className="flex items-center justify-center">
          <Link href="/">
            <h1 className="font-bold text-xl">What Surv?</h1>
          </Link>
        </div>
        <div className=" flex justify-end gap-4 p-2">
          {isLoggedIn ? (
            <>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">Open Menu</Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem>
                    <Link href="/profile">
                      <p className="  font-bold ">프로필 설정</p>
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="copy">
                    <p onClick={handleLogout} className=" font-bold">
                      로그아웃
                    </p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
