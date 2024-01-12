import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import {PrevArrow, NextArrow} from './CustomArrow';

export default function Banner() {
  const bannerList = [1, 2, 3, 4, 5, 6];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: (i: number) => {
      return (
        <span className="customPaging">
          <span className="currentPage">{(i + 1).toString().padStart(2, '0')}</span>/
          <span className="totalPage">{bannerList.length.toString().padStart(2, '0')}</span>
        </span>
      );
    },
  };
  return (
    <div className="mt-20 h-[340px]">
      <StSlider {...settings}>
        <div>
          <h3>지겨운</h3>
        </div>
        <div>
          <h3>카르셀</h3>
        </div>
        <div>
          <h3>커스텀</h3>
        </div>
        <div>
          <h3>구현하기</h3>
        </div>
        <div>
          <h3>흑흑</h3>
        </div>
        <div>
          <h3>흑흑</h3>
        </div>
      </StSlider>
    </div>
  );
}

const StSlider = styled(Slider)`
  height: 300px;
  background-color: #e5e7eb;
  position: relative;
  .slick-slide div {
    outline: none;
  }
  .slick-dots {
    position: absolute;
    bottom: -32px;
    right: 22px;
    font-size: 16px;
    line-height: 29px;
    width: 60px;
    height: 30px;

    font-weight: 600;
    li {
      display: none;
    }
    .slick-active {
      display: block;
    }
    .customPaging {
      gap: 10px;
    }
    .totalPage {
      color: #888;
    }
  }
`;
