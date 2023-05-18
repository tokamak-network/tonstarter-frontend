import React from 'react';
import '../styles/cell.scss';

type CellProps = {
  isActive?: boolean | Date;
  isToday?: boolean;
  isRange?: boolean | null | undefined;
  isStart?: boolean | null | undefined;
  isEnd?: boolean | null | undefined;
  startDate?: Date | null;
  endDate?: Date | null;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export const Cell: React.FC<CellProps> = ({
  className,
  isToday,
  isRange = false,
  isStart = false,
  isEnd = false,
  isActive = false,
  startDate,
  endDate,
  children,
  onClick,
}) => {
  const activeClass =
    isActive || (isRange && isStart)
      ? 'cell__selected'
      : isToday
      ? 'cell__today'
      : '';
  const activeStartRange = isRange && startDate ? 'cell__range__start' : '';
  const activeEndRange = isRange && endDate ? 'cell__range__end' : '';
  const activeRange = isRange && startDate && endDate ? 'cell__range' : '';

  let cellClassName = className;
  if (isRange) {
    if (isStart) {
      cellClassName += ` ${activeStartRange}`;
    } else if (isEnd) {
      cellClassName += ` ${activeEndRange}`;
    } else if (isRange) {
      cellClassName += ` ${activeRange}`;
    }
  }

  return (
    <div onClick={onClick} className={`${cellClassName} ${activeClass}`}>
      {children}
    </div>
  );
};
