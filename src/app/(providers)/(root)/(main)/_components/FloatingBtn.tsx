import React from 'react';
import {Button} from '@nextui-org/react';
import Link from 'next/link';
import {LuPencilLine} from 'react-icons/lu';

export default function FloatingBtn() {
  return (
    <div className="flex justify-end sticky bottom-10">
      <Button isIconOnly color="primary" aria-label="write-post" className="w-[50px] h-[50px] rounded-full">
        <Link href="/create_post">
          <LuPencilLine />
        </Link>
      </Button>
    </div>
  );
}
