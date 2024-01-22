'use client';
import {auth, db, storage} from '@/firebase';
import {Button, Input, Select, SelectItem} from '@nextui-org/react';
import {onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {useRouter} from 'next/navigation';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import {PiUserRectangleFill} from 'react-icons/pi';
import {MoonLoader} from 'react-spinners';
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
        alert('로그인이 필요합니다');
        router.push('/auth');
      }
    });
    // 컴포넌트가 언마운트될 때 제거
    return () => unsubscribe();
  }, []);

  const router = useRouter();

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
      setIsNickNameEditing(false);
    }
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
  };

  const sexTypes: SexType[] = [
    {value: '남성', label: '남성'},
    {value: '여성', label: '여성'},
  ];

  const clickSelectSexHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSexType(e.target.value); // 이벤트 객체에서 value를 추출하여 상태 업데이트
  };

  return (
    <div className="text-lg leading-10 w-[500px] m-auto mt-[80px]">
      <h1 className="text-[#0051FF] text-3xl mb-[20px] mt-[30px] text-center">
        <span className="font-bold">{userProfile?.nickName}</span>님의 프로필
      </h1>
      <div className="w-[200px] m-auto mt-[30px]" onClick={clickImageHandler} style={{cursor: 'pointer'}}>
        {userProfile?.photoURL ? (
          <div className="w-[200px] h-[200px] bg-green-100 rounded-full relative overflow-hidden ">
            <img
              src={userProfile.photoURL}
              className="w-full h-full  absolute top-0 left-0  object-cover  "
              alt="Profile"
            />
          </div>
        ) : (
          <PiUserRectangleFill size={200} /> // 기본 아이콘 표시
        )}
      </div>
      <input type="file" onChange={clickProfileImageHandler} ref={fileInputRef} className="hidden" />

      <p className="mb-[15px] mt-[40px]">
        <span className="font-bold ">이메일</span> {userProfile.email}
      </p>
      {isNickNameEditing ? (
        <div className="flex justify-start items-center mb-[20px]">
          <label className="font-bold">닉네임</label>
          <Input
            type="text"
            value={newNickName}
            variant="bordered"
            className="text-lg w-[3/4] ml-[10px]    bg-[#fff] rounded-xl "
            labelPlacement="outside"
            onChange={e => setNewNickName(e.target.value)}
          />
          <Button onClick={clickNickNameSaveHandler} className="bg-[#0051FF] text-white ml-[10px]">
            저장
          </Button>
        </div>
      ) : (
        <div className="flex justify-start   items-center mb-[15px]">
          <p className="font-bold ">닉네임 {userProfile?.nickName}</p>
          <Button onClick={clickNickNameEditModeHandler} className="bg-[#0051FF] text-white ml-[10px]">
            닉네임 변경
          </Button>
        </div>
      )}
      {userProfile.birthDate === '' ? (
        <div className="flex justify-start  items-center mb-[15px]">
          <label className="mr-[10px] font-bold">생년월일</label>
          <Input
            variant="bordered"
            type="date"
            labelPlacement="outside-left"
            className="w-[3/4]  bg-[#fff] rounded-xl "
            value={newBirthDate}
            onChange={e => setNewBirthDate(e.target.value)}
          />
          <Button onClick={clickSaveBirthDateHandler} className="bg-[#0051FF] text-white ml-[10px]">
            생년월일 저장
          </Button>
        </div>
      ) : (
        <p className="font-bold mb-[10px]">생년월일: {userProfile.birthDate}</p>
      )}
      {/* 성별 선택 드롭다운 또는 텍스트 표시 */}
      {userProfile.sexType === '--미설정--' ? (
        <div>
          <label className="mr-[10px] font-bold">성별</label>
          <Select
            items={sexTypes}
            variant="bordered"
            placeholder="--성별을 선택해주세요--"
            className="max-w-xs bg-[#fff] rounded-xl"
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
        <p className="font-bold">성별: {userProfile.sexType}</p>
      )}
    </div>
  );
}
