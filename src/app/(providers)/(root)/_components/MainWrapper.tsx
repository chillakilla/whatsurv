import React from 'react';
import FloatingBtn from '../(main)/_components/FloatingBtn';

type Props = {
  children: React.ReactNode;
};

export default function MainWrapper({children}: Props) {
  return <div>{children}</div>;
}
