import {db} from '@/firebase';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import {Post} from './typePost';
import firebase from 'firebase/compat/app';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';

// 게시글 목록 불러오기 fetchPosts
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const postsQuery = query(collection(db, 'posts'));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
    const posts: Post[] = snapshot.docs.map(
      (doc: DocumentSnapshot<DocumentData>) => ({id: doc.id, ...(doc.data() as any)} as Post),
    );
    return posts;
  } catch (error) {
    console.error('에러', error);
    throw new Error('게시글을 불러오는 것에 실패했습니다.');
  }
};

// 단일 게시글 정보 불러오기 fetchPostById
export const fetchPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc: DocumentSnapshot<DocumentData> = await getDoc(postRef);

    if (postDoc.exists()) {
      const postData: Post = {id: postDoc.id, ...(postDoc.data() as any)} as Post;
      return postData;
    } else {
      console.error('게시글을 찾을 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('에러', error);
    throw new Error('게시글을 불러오는 것에 실패했습니다.');
  }
};

// 게시글 추가하기 addPost
export const addPost = async (newPost: Omit<Post, 'id' | 'createdAt'>): Promise<DocumentReference> => {
  try {
    const createdAt = new Date();
    const docRef = await addDoc(collection(db, 'posts'), {...newPost, createdAt});

    return docRef;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('게시글을 추가하는 것에 실패했습니다.');
  }
};

// 게시글 수정하기 updatePost
export const updatePost = async (postId: string, updatedPost: Omit<Post, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, updatedPost);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw new Error('게시글을 수정하는 것에 실패했습니다.');
  }
};

// 게시글 삭제하기 deletePost
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw new Error('게시글을 삭제하는 것에 실패했습니다.');
  }
};

// 업로드한 이미지 storage에 저장
export const uploadImageToStorage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);

  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
};

// 게시글+사용자(작성자) 정보 불러오기 fetchPostWithUser
//TODO: 240111 할 것 = 유저 정보 불러오는 로직 작성
//TODO: 해당 로직은 미완성.
// export const fetchPostsWithUser = async (): Promise<PostWithUser[]> => {
//   try {
//     const postsQuery = query(collection(db, 'posts'));
//     const snapshot: QuerySnapshot<DocumentData> = await getDocs(postsQuery);
//     const postsWithUser: PostWithUser[] = [];

//     for (const doc of snapshot.docs) {
//       const postData: Post = { id: doc.id, ...(doc.data() as any) } as Post;
//       const user = await fetchUserById(postData.userId); // Implement fetchUserById

//       if (user) {
//         const postWithUser: PostWithUser = { ...postData, user };
//         postsWithUser.push(postWithUser);
//       }
//     }

//     return postsWithUser;
//   } catch (error) {
//     console.error('에러', error);
//     throw new Error('게시글을 불러오는 것에 실패했습니다.');
//   }
// };
