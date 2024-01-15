import {Pagination} from '@nextui-org/react';
import {useState} from 'react';

export default function Paging() {
  const [page, setPage] = useState(1);
  const listPerPage = 8;
  const changePageHandler = (page: number) => {
    setPage(page);
  };
  return (
    <div className="my-10 flex justify-center">
      <Pagination showControls total={page} initialPage={1} onChange={changePageHandler} />
    </div>
  );
}
