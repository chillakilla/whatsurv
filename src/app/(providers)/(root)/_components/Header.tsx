'use client';
import {getUserProfile} from '@/app/api/getUserProfile';
import {auth} from '@/firebase';
import {Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@nextui-org/react';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Tab from './Tab';
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async user => {
  //     setIsLoggedIn(!!user);
  //     if (user) {
  //       setUserId(user.uid);
  //       const userDoc = await getDoc(doc(db, 'users', user.uid));
  //       const photoURL = userDoc.data()?.photoURL;
  //       setUserPhotoURL(photoURL);
  //     } else {
  //       setUserPhotoURL(null);
  //       setUserId(null);
  //     }
  //
  //     //console.log(user);
  //   });
  //
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
      setUserId(user?.uid || null);
    });

    return () => unsubscribe();
  }, []);

  // 사용자 프로필 정보를 가져오는 쿼리
  const {data: userProfile, status} = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });

  const clickLogoutHandler = async () => {
    await auth.signOut();
    router.push('/auth');
  };

  return (
    <header className="select-none bg-white">
      <section className="max-w-[1450px] flex justify-between items-center m-auto ">
        <div className="flex items-center justify-center ml-[30px]">
          <Link href="/">
            <h1 className="font-bold text-xl">
              <img src="/image/whatsurv.svg" className="h-[24px]" />
            </h1>
          </Link>
        </div>
        <div className=" flex justify-end gap-4 p-2 mr-[20px]">
          {isLoggedIn ? (
            <div className="flex items-center">
              <p className="font-bold mr-[10px] text-[#0051FF]">{userProfile?.nickname}</p>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar isBordered as="button" className="transition-transform" src={userProfile?.photoURL || ''} />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem textValue="내가 작성한 서베이">
                    <Link href={`/profile-post/${userId}`}>
                      <p className="font-bold">내가 작성한 서베이</p>
                    </Link>
                  </DropdownItem>
                  <DropdownItem textValue="프로필 설정">
                    <Link href="/profile">
                      <p className="  font-bold ">프로필 설정</p>
                    </Link>
                  </DropdownItem>
                  <DropdownItem textValue="로그아웃">
                    <p onClick={clickLogoutHandler} className=" text-[#EB271C] font-bold">
                      로그아웃
                    </p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <>
              <Link href="/join">
                <Button variant="ghost" className="font-bold border-[#D2D7E0] border-2">
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
      <Tab />
    </header>
  );
}
