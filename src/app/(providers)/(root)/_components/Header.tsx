'use client';
import {auth, db} from '@/firebase';
import {Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@nextui-org/react';
import {doc, getDoc} from 'firebase/firestore';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setIsLoggedIn(!!user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const photoURL = userDoc.data()?.photoURL;
        setUserPhotoURL(photoURL);
        console.log(user);
      } else {
        setUserPhotoURL(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const clickLogoutHandler = async () => {
    await auth.signOut();
    router.push('/auth');
  };

  return (
    <header>
      <section className="w-[1400px] flex justify-between items-center m-auto ">
        <div className="flex items-center justify-center">
          <Link href="/">
            <h1 className="font-bold text-xl">
              <img src="/image/whatsurv.svg" className="h-[24px]" />
            </h1>
          </Link>
        </div>
        <div className=" flex justify-end gap-4 p-2">
          {isLoggedIn ? (
            <>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar isBordered as="button" className="transition-transform" src={userPhotoURL || ''} />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem textValue="프로필 설정">
                    <Link href="/profile">
                      <p className="  font-bold ">프로필 설정</p>
                    </Link>
                  </DropdownItem>
                  <DropdownItem textValue="로그아웃">
                    <p onClick={clickLogoutHandler} className=" text-red-500 font-bold">
                      로그아웃
                    </p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <Link href="/join">
                <Button variant="ghost" className="font-bold border-[#d2d7e0] border-2">
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
