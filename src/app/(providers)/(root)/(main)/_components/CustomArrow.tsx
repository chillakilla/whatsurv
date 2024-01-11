import {GrPrevious} from 'react-icons/gr';
import {GrNext} from 'react-icons/gr';
import {BsArrowLeftSquare} from 'react-icons/bs';
import {BsArrowRightSquare} from 'react-icons/bs';

type ArrowProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const NextArrow = ({onClick}: ArrowProps) => {
  return (
    <button onClick={onClick} type="button" className="absolute bottom-[-24px] left-[1185px] z-1 w-[30px]">
      <GrNext />
    </button>
  );
};

export const PrevArrow = ({onClick}: ArrowProps) => {
  return (
    <button onClick={onClick} type="button" className="absolute bottom-[-24px] left-[1088px] z-1 w-[30px]">
      <GrPrevious />
    </button>
  );
};

export const PopularPrevArrow = ({onClick}: ArrowProps) => {
  return (
    <button onClick={onClick} type="button" className="absolute top-[-31px] left-28 z-1 w-[30px]">
      <BsArrowLeftSquare />
    </button>
  );
};

export const PopularNextArrow = ({onClick}: ArrowProps) => {
  return (
    <button onClick={onClick} type="button" className="absolute top-[-31px] left-40 z-1 w-[30px]">
      <BsArrowRightSquare />
    </button>
  );
};
