import React from 'react';

export default function Footer() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-20 bg-white bottom-0 -z-5">
      <p>©WhatSurv</p>
      <div className="flex gap-2">
        <img className="icon" src="/image/github.svg" alt="githu7b-icon" />
        <p>김동학, 이다원, 최광희, 이희원</p>
      </div>
    </div>
  );
}
