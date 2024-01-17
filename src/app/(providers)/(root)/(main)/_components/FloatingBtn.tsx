import React from 'react';
import {Button} from '@nextui-org/react';
import Link from 'next/link';
import {LuPencilLine} from 'react-icons/lu';

export default function FloatingBtn() {
  return (
    <div className="flex justify-end sticky bottom-10">
      <Link href="/create-post">
        <Button isIconOnly aria-label="write-post" className="w-[50px] h-[50px] rounded-full bg-gray-200">
          <LuPencilLine />
        </Button>
      </Link>
    </div>
  );
}
