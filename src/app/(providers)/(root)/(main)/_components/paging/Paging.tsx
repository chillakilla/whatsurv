import React from 'react';
import Link from 'next/link';
import {useState} from 'react';

interface PaginationProps {
  currentPage: number;
  totalContents: number;
  paginate: (pageNumber: number) => void;
  contentsPerPage: number;
}

export default function Paging({totalContents, paginate, contentsPerPage}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageNumbers: number[] = [];
  const maxPageNum = Math.ceil(totalContents / contentsPerPage);

  for (let i = 1; i <= Math.ceil(totalContents / contentsPerPage); i++) {
    pageNumbers.push(i);
  }

  const updatePageNumbers = (page: number) => {
    let startPage = page - 4 > 1 ? page - 4 : 1;
    let endPage = startPage + 9 > maxPageNum ? maxPageNum : startPage + 9;

    while (endPage - startPage < 9 && startPage > 1) {
      startPage--;
    }
    return pageNumbers.slice(startPage - 1, endPage);
  };

  const [currentNumbers, setCurrentNumbers] = useState(updatePageNumbers(1));
  const visiblePageNumbers = updatePageNumbers(currentPage);

  // 첫 페이지로 가기
  const moveFirstPageHandler = () => {
    setCurrentPage(1);
    paginate(1);
  };

  // 마지막 페이지로 가기
  const moveLastPageHandler = () => {
    setCurrentPage(maxPageNum);
    paginate(maxPageNum);
  };

  // 번호눌렀을 때
  const clickNumberHanlder = (number: number) => {
    setCurrentPage(number);
    setCurrentNumbers(updatePageNumbers(number));
    paginate(number);
  };

  return (
    <nav>
      <ul className="flex gap-4">
        <li>
          <Link href="#" onClick={() => moveFirstPageHandler()}>
            {'<<'}
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => clickNumberHanlder(currentPage - 1)}>
            {'<'}
          </Link>
        </li>
        {visiblePageNumbers.map(number => {
          return (
            <>
              <li key={number}>
                <Link
                  href="#"
                  onClick={() => clickNumberHanlder(number)}
                  className={number === currentPage ? 'currentPage' : ''}
                >
                  {number}
                </Link>
              </li>
            </>
          );
        })}
        <li>
          <Link href="#" onClick={() => clickNumberHanlder(currentPage + 1)}>
            {'>'}
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => moveLastPageHandler()}>
            {'>>'}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
