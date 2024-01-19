'use client';
import {auth, db} from '@/firebase';
import {Button, Input} from '@nextui-org/react';
import {onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useEffect, useState} from 'react';
interface UserProfileType {
  email: string | null;
  nickName: string | null;
  birthDate?: string;
  sexType?: string;
  ageGroup?: string;
}
export default function ProfilePage() {
  //유저 프로필 불러오기
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  //닉네임 변경 관련
  const [isNickNameEditing, setIsNickNameEditing] = useState(false);
  const [newNickName, setNewNickName] = useState('');

  //연령대와 성별
  const [sexType, setSexType] = useState('--미설정--');
  const [ageGroup, setAgeGroup] = useState('--미설정--');

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
            ageGroup: userData.ageGroup,
            sexType: userData.sexType,
          });
        }
      } else {
        setUserProfile(null);
      }
    });
    // 컴포넌트가 언마운트될 때 제거
    return () => unsubscribe();
  }, []);

  if (!userProfile) {
    return <div>로딩 중...</div>;
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

  return (
    <div>
      <h1>프로필</h1>
      <p>이메일: {userProfile.email}</p>
      {isNickNameEditing ? (
        <div className="flex">
          닉네임:
          <Input type="text" value={newNickName} className="w-[3/4]" onChange={e => setNewNickName(e.target.value)} />
          <Button onClick={clickNickNameSaveHandler}>저장</Button>
        </div>
      ) : (
        <div className="flex">
          <p>닉네임: {userProfile?.nickName}</p>
          <Button onClick={clickNickNameEditModeHandler}>닉네임 변경</Button>
        </div>
      )}
      {userProfile.birthDate === '' ? (
        <div>
          <label>생년월일:</label>
          <div className="flex">
            <Input
              type="date"
              className="w-[3/4]"
              value={newBirthDate}
              onChange={e => setNewBirthDate(e.target.value)}
            />
            <Button onClick={clickSaveBirthDateHandler}>생년월일 저장</Button>
          </div>
        </div>
      ) : (
        <p>생년월일: {userProfile.birthDate}</p>
      )}
      {/* 성별 선택 드롭다운 또는 텍스트 표시 */}
      {userProfile.sexType === '--미설정--' ? (
        <div>
          <label>성별:</label>
          <select value={sexType} onChange={e => setSexType(e.target.value)}>
            <option value="--미설정--">--미설정--</option>
            <option value="전체">전체</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
          <Button onClick={clickSaveSexTypeHandler}>성별 저장</Button>
        </div>
      ) : (
        <p>성별: {userProfile.sexType}</p>
      )}

      <p>연령대: {userProfile.ageGroup}</p>
    </div>
  );
}
