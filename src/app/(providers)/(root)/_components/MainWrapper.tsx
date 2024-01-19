import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function MainWrapper({children}: Props) {
  return <div>{children}</div>;
}
