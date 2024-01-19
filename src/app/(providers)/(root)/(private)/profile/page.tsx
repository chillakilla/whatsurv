'use client';
import {auth, db} from '@/firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useEffect, useState} from 'react';
interface UserProfileType {
  email: string | null;
  nickName: string | null;
  birthDate?: string;
}
export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newNickName, setNewNickName] = useState('');

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
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setNewNickName(userProfile?.nickName || '');
  };

  // 닉네임 저장 함수
  const saveNickName = async () => {
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
      setIsEditing(false);
    }
  };

  return (
    <div>
      <h1>프로필 페이지</h1>
      <p>이메일: {userProfile.email}</p>
      {isEditing ? (
        <div>
          <input type="text" value={newNickName} onChange={e => setNewNickName(e.target.value)} />
          <button onClick={saveNickName}>저장</button>
        </div>
      ) : (
        <button onClick={toggleEdit}>닉네임 변경</button>
      )}
      <p>생년월일: {userProfile.birthDate}</p>
    </div>
  );
}
