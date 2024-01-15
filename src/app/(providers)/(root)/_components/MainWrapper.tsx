import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function MainWrapper({children}: Props) {
  return <div className="w-[88.5rem] m-auto mb-20">{children}</div>;
}
