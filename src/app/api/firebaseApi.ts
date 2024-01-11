import {
  DocumentData,
  DocumentSnapshot,
  getDocs,
  query,
  QuerySnapshot,
  collection,
  addDoc,
  DocumentReference,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {db} from '@/firebase';
import {Post} from './typePost';

// 게시글 불러오기 fetchPost
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
