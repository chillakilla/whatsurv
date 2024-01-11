import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import {PopularPrevArrow, PopularNextArrow} from './CustomArrow';

export default function Popular() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: false,
    prevArrow: <PopularPrevArrow />,
    nextArrow: <PopularNextArrow />,
  };
  return (
    <div className="mt-20 h-[340px]">
      <h2 className="font-bold text-lg mb-[8px]">인기 게시글</h2>
      <StSlider {...settings}>
        <div className="bg-gray-100 h-48 p-4 rounded-xl">
          <h3>지겨운</h3>
        </div>
        <div className="bg-gray-100 h-48 p-4 rounded-xl">
          <h3>카르셀</h3>
        </div>
        <div className="bg-gray-100 h-48 p-4 rounded-xl">
          <h3>커스텀</h3>
        </div>
        <div className="bg-gray-100 h-48 p-4 rounded-xl">
          <h3>구현하기</h3>
        </div>
        <div className="bg-gray-100 h-48 p-4 rounded-xl">
          <h3>흑흑</h3>
        </div>
        <div className="bg-gray-100 h-48 p-4 rounded-xl">
          <h3>흑흑</h3>
        </div>
      </StSlider>
    </div>
  );
}

const StSlider = styled(Slider)`
  height: 200px;
  gap: 10px;
  position: relative;
  display: flex;
  align-items: center;

  .slick-list {
    margin-right: 10px;
  }

  .slick-slide div {
    outline: none;
    margin-right: 10px;
  }
`;
