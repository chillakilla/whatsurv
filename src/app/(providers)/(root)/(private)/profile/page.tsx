'use client';
import {updateNicknameInDocs, updateNicknameInLite} from '@/app/api/firebaseApi';
import {auth, db, storage} from '@/firebase';
import {Button, Input, Select, SelectItem} from '@nextui-org/react';
import {useQueryClient} from '@tanstack/react-query';
import {onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useRouter} from 'next/navigation';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {FaCamera} from 'react-icons/fa';
import {FaRegCircleUser} from 'react-icons/fa6';
import {MoonLoader} from 'react-spinners';
import Swal from 'sweetalert2';
interface UserProfileType {
  email: string | null;
  nickName: string | null;
  birthDate?: string;
  sexType?: string;
  photoURL?: string;
}

interface SexType {
  value: string;
  label: string;
}

export default function ProfilePage() {
  //유저 프로필 불러오기
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  //닉네임 변경 관련
  const [isNickNameEditing, setIsNickNameEditing] = useState(false);
  const [newNickName, setNewNickName] = useState('');

  //연령대와 성별
  const [sexType, setSexType] = useState('--미설정--');

  //성별 설정 한번만 가능한지 확인 여부
  const showSexTypeDropdown = userProfile?.sexType === '--미설정--';

  //생일 없는 경우 추가하기 위한 상태
  const [newBirthDate, setNewBirthDate] = useState('');

  useEffect(() => {
    //현재 로그인 한 사용자의 상태 감지
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        // Firestore의 'users' 컬렉션에서 현재 사용자의 문서를 가져옴
        const userDocRef = doc(db, 'users', user.uid);
        // 해당 문서의 스냅샷을 가져옴
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Firestore 문서에서 필요한 데이터 추출
          const userData = userDocSnap.data();

          // 사용자 프로필 상태 업데이트
          setUserProfile({
            email: user.email,
            nickName: userData.nickname,
            birthDate: userData.birthdate,
            photoURL: userData.photoURL,
            sexType: userData.sexType,
          });
        }
      } else {
        setUserProfile(null);
        Swal.fire({
          title: '로그인이 필요합니다.',
          confirmButtonColor: '#0051FF',
          icon: 'error',
        });
        router.push('/auth');
      }
    });
    // 컴포넌트가 언마운트될 때 제거
    return () => unsubscribe();
  }, []);

  const router = useRouter();
  const queryClient = useQueryClient();
  // 파일 입력 참조 생성
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!userProfile) {
    return (
      <div className="flex justify-center flex-wrap items-center overflow-y-hidden mt-[300px]">
        <MoonLoader color="#0051FF" size={100} />
        <p className="text-[#0051FF] w-full text-center mt-[30px]">잠시만 기다려 주세요..</p>
      </div>
    );
  }

  // 닉네임 편집 모드 전환 함수
  const clickNickNameEditModeHandler = () => {
    setIsNickNameEditing(!isNickNameEditing);
    setNewNickName(userProfile?.nickName || '');
  };

  // 닉네임 저장 함수
  const clickNickNameSaveHandler = async () => {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        nickname: newNickName,
      });
      setUserProfile(prev => {
        if (prev === null) return null;
        return {
          ...prev, // 기존 상태를 유지하면서
          nickName: newNickName, // 닉네임만 업데이트
        };
      });

      await updateNicknameInDocs(auth.currentUser.uid, newNickName);
      await updateNicknameInLite(auth.currentUser.uid, newNickName);
      setIsNickNameEditing(false);
    }
    console.log('닉네임 업데이트 완료, 쿼리 무효화 시작');

    if (auth.currentUser?.uid) {
      queryClient.invalidateQueries({
        queryKey: ['userProfile', auth.currentUser.uid],
      });
    }
    console.log('쿼리 무효화 완료');
  };

  // 성별 저장 함수
  const clickSaveSexTypeHandler = async () => {
    if (auth.currentUser && userProfile) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        sexType: sexType,
      });
      setUserProfile({
        ...userProfile,
        sexType: sexType,
      });
    }
  };

  // 생년월일 저장 함수
  const clickSaveBirthDateHandler = async () => {
    if (auth.currentUser && newBirthDate) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        birthdate: newBirthDate,
      });
      setUserProfile({
        ...userProfile,
        birthDate: newBirthDate,
      });
    }
  };

  // 이미지 클릭 핸들러
  const clickImageHandler = () => {
    fileInputRef.current?.click();
  };

  // 이미지 업로드 및 Firestore에 URL 저장
  const clickProfileImageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !auth.currentUser) return;

    const storageRef = ref(storage, `ProfilePic/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    await updateDoc(doc(db, 'users', auth.currentUser.uid), {photoURL});
    setUserProfile(prev => {
      if (prev === null) return null;
      return {
        ...prev,
        photoURL: photoURL,
      };
    });
    //! 원인찾기1. 헤더 쿼리 상태와 프로필 페이지 쿼리 무효화 되는지 확인하기
    console.log('이미지 업로드 완료, 쿼리 무효화 시작');

    if (auth.currentUser.uid) {
      queryClient.invalidateQueries({
        queryKey: ['userProfile', auth.currentUser.uid],
      });
    }
    console.log('쿼리 무효화 완료');
  };

  const sexTypes: SexType[] = [
    {value: '남성', label: '남성'},
    {value: '여성', label: '여성'},
  ];

  const clickSelectSexHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSexType(e.target.value); // 이벤트 객체에서 value를 추출하여 상태 업데이트
  };

  return (
    <div className="text-lg leading-10 w-[400px] m-auto mt-[80px] select-none">
      <div className="w-[200px] m-auto mt-[30px]" style={{cursor: 'pointer'}}>
        {userProfile?.photoURL ? (
          <div className="relative">
            <div className="w-[200px] h-[200px]  rounded-full overflow-hidden ">
              <img
                src={userProfile.photoURL}
                className="w-full h-full  absolute border-white border-5 top-0 left-0  rounded-full object-cover  "
                alt="Profile"
              />
            </div>
            <p
              onClick={clickImageHandler}
              className="m-auto absolute rounded-full bg-white  p-[10px] left-[75px] bottom-[-15px]"
            >
              <FaCamera size={25} className="camera-icon  " />
            </p>
          </div>
        ) : (
          <div className="relative">
            <FaRegCircleUser size={200} className="text-[#0051FF] rounded-full  bg-white border-white border-5" />
            <p
              onClick={clickImageHandler}
              className="m-auto absolute rounded-full bg-white  p-[10px] left-[75px] bottom-[-15px]"
            >
              <FaCamera size={25} className="camera-icon " />
            </p>
          </div>
        )}
      </div>
      <input
        type="file"
        onChange={clickProfileImageHandler}
        aria-label="프로필 이미지 업로드"
        ref={fileInputRef}
        className="hidden"
      />
      <h1 className="text-[#0051FF] text-3xl  mt-[30px] text-center">
        <span className="font-bold">{userProfile?.nickName}</span>님의 프로필
      </h1>
      <p className="mb-[15px] mt-[0px] text-center">{userProfile.email}</p>
      <hr className="mb-[30px]" />
      {isNickNameEditing ? (
        <div className="flex justify-center items-center mb-[20px]">
          <label className="font-bold">닉네임</label>
          <Input
            type="text"
            value={newNickName}
            aria-label="닉네임"
            variant="bordered"
            className="text-lg w-[205px] ml-[10px]    bg-[#fff] rounded-xl "
            labelPlacement="outside"
            onChange={e => setNewNickName(e.target.value)}
          />
          <Button onClick={clickNickNameSaveHandler} className="bg-[#0051FF] text-white ml-[10px]">
            닉네임 저장
          </Button>
        </div>
      ) : (
        <div className="flex justify-center  items-center mb-[20px]">
          <p className="font-bold">닉네임</p>
          <p className="ml-[10px] w-[200px] rounded-xl text-sm px-[3px] py-[8px] border-2 border-default-200  pl-[12px] shadow-sm bg-white">
            {userProfile?.nickName}
          </p>
          <Button
            onClick={clickNickNameEditModeHandler}
            variant="ghost"
            className=" text-white ml-[10px] border-3 border-[#0051FF] font-bold text-[#0051FF] "
          >
            닉네임 변경
          </Button>
        </div>
      )}
      {userProfile.birthDate === '' ? (
        <div className="flex justify-start items-center mb-[20px] ml-[17px]">
          <label className="mr-[10px] font-bold">생년월일</label>
          <Input
            variant="bordered"
            type="date"
            aria-label="생년월일"
            labelPlacement="outside-left"
            className="w-[3/4] bg-[#fff] rounded-xl "
            value={newBirthDate}
            onChange={e => setNewBirthDate(e.target.value)}
          />
          <Button onClick={clickSaveBirthDateHandler} className="bg-[#0051FF] text-white ml-[10px]">
            생년월일 저장
          </Button>
        </div>
      ) : (
        <div className="font-bold flex items-center mb-[20px] justify-center ">
          <p className="font-bold">생년월일</p>
          <p className="ml-[10px] w-[290px] rounded-xl text-sm px-[3px] py-[8px] border-2 border-default-200  pl-[10px] shadow-sm bg-white">
            {userProfile.birthDate}
          </p>
        </div>
      )}
      {/* 성별 선택 드롭다운 또는 텍스트 표시 */}
      {userProfile.sexType === '--미설정--' ? (
        <div className="flex justify-center">
          <label className="mr-[10px] font-bold">성별</label>
          <Select
            items={sexTypes}
            aria-label="성별 선택"
            variant="bordered"
            placeholder="--성별을 선택해주세요--"
            className="w-[232px] bg-[#fff] rounded-xl"
            value={sexType}
            labelPlacement="outside-left"
            onChange={clickSelectSexHandler}
          >
            {item => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
          <Button onClick={clickSaveSexTypeHandler} className="bg-[#0051FF] text-white ml-[10px]">
            성별 저장
          </Button>
        </div>
      ) : (
        <div className="font-bold flex items-center justify-center ">
          <p>성별</p>
          <p className="ml-[10px] w-[325px] rounded-xl text-sm px-[3px] py-[8px] border-2 border-default-200  pl-[10px] shadow-sm bg-white">
            {userProfile.sexType}
          </p>
        </div>
      )}
    </div>
  );
}
