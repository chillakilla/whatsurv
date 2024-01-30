import React from 'react';
import {FaHeart, FaRegHeart} from 'react-icons/fa';

interface LikeButtonProps {
  onClick: () => void;
  likes: number;
  isLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({onClick, likes, isLiked}) => {
  return (
    <button onClick={onClick} className="like-button w-12 h-[1.25rem] flex justify-evenly items-center text-[#0051FF]">
      {likes} {isLiked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default LikeButton;
