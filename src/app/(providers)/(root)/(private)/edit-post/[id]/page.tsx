// import React from 'react';

// export default function EditPostFormPage() {
//   return (
//     <div className="w-screen h-screen flex flex-col justify-center items-center">
//       <div className="w-6/12 h-6/12 flex justify-center items-center">
//         <h1 className="text-3xl">🚧&nbsp;아직 구현되지 않았습니다.&nbsp;🚧</h1>
//       </div>
//     </div>
//   );
// }

'use client';

import React, {useState, useEffect} from 'react';
import {useRouter, useParams} from 'next/navigation';
import PostForm from '../../create-post/_components/PostForm'; // Assuming the provided component is stored in a file called PostForm.js
import {getPostById, updatePost} from '@/app/api/firebaseApi';
import {Post} from '@/app/api/typePost';

export default function EditPostPage() {
  const {id} = useParams();
  const router = useRouter();
  const postId = Array.isArray(id) ? id[0] : id;

  const [formData, setFormData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      getPostById(postId)
        .then(postData => {
          setFormData(postData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching post data:', error);
          setLoading(false);
        });
    }
  }, [postId]);

  const handleFormSubmit = async updatedFormData => {
    try {
      await updatePost(postId, updatedFormData);
      // Redirect user to the post detail page or any other desired page
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error('Error updating post:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {formData ? (
        <PostForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          // You might need to pass other necessary props to PostForm component
        />
      ) : (
        <div>Post not found</div>
      )}
    </div>
  );
}
