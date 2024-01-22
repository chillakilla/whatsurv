import {auth, db} from '@/firebase';
import {Button} from '@nextui-org/react';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {useRouter} from 'next/navigation';
import Swal from 'sweetalert2';

export default function SocialLogin() {
  const router = useRouter();
  const googleLogin = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence); // 세션 지속성 설정
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestore에 저장할 사용자 정보
      const userData = {
        nickname: user.displayName || '기본닉네임',
        email: user.email,
        // 구글API에서 생년월일은 미지원으로 생년월일은 초기에 빈 값으로 설정
        birthdate: '',

        sexType: '--미설정--',
      };

      // 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), userData);

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
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 이메일이 없는 경우, 대체할 값을 사용
      const userEmail = user.email || `${user.uid}@no-email.com`;

      // Firestore에 저장할 사용자 정보
      const userData = {
        nickname: user.displayName || userEmail.split('@')[0], // GitHub username 또는 이메일을 사용
        email: userEmail,
        //생년월일은 초기에 빈 값으로 설정
        birthdate: '',

        sexType: '--미설정--',
      };

      // 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), userData);

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
