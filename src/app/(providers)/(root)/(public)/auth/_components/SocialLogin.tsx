import {auth, db} from '@/firebase';
import {Button} from '@nextui-org/react';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import Swal from 'sweetalert2';
export default function SocialLogin() {
  const router = useRouter();

  const updateUserProfile = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    // Firestore에 사용자 데이터가 없는 경우에만 초기 데이터 설정
    if (!docSnap.exists()) {
      // 이메일이 없는 경우, 대체 이메일 주소 생성
      const userEmail = user.email || `${user.uid}@no-email.com`;
      const userData = {
        nickname: user.displayName || userEmail.split('@')[0],
        email: userEmail,
        birthdate: '',
        sexType: '--미설정--',
        photoURL: user.photoURL || '',
      };
      await setDoc(userRef, userData);
    }
  };

  const googleLogin = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence); // 세션 지속성 설정

      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await updateUserProfile(result.user);
      Swal.fire({
        title: '로그인 성공!',
        icon: 'success',
        confirmButtonText: '확인',
        confirmButtonColor: '#0051FF',
      });
      router.push('/');
    } catch (error) {
      console.error('Google 로그인 실패:', error);
    }
  };

  // GitHub 로그인 함수
  const githubLogin = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence); // 세션 지속성 설정
      const result = await signInWithPopup(auth, new GithubAuthProvider());
      await updateUserProfile(result.user); // updateUserProfile 함수 사용

      Swal.fire({
        title: '로그인 성공!',
        icon: 'success',
        confirmButtonText: '확인',
        confirmButtonColor: '#0051FF',
      });
      router.push('/');
    } catch (error) {
      console.error('GitHub 로그인 실패:', error);
    }
  };
  return (
    <div className="text-center font-bold mt-[30px]">
      <p className="text-xl">간편 로그인</p>
      <Button onClick={googleLogin} className="h-[50px] mt-[20px] bg-transparent	">
        <img src="/image/google_icon.svg" />
      </Button>
      <Button onClick={githubLogin} className="h-[50px] mt-[20px] bg-transparent	">
        <img src="/image/github_icon.svg" />
      </Button>
    </div>
  );
}
