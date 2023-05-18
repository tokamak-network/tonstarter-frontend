import React from 'react';
import { Button } from './Button';
import '../styles/clock.scss';

type ActionBarProps = {
  onClick?: () => void;
  onReset?: () => void;
};

export const ActionBar: React.FC<ActionBarProps> = ({ onClick, onReset }) => {
  return (
    <div className='date-time-selector__actions'>
      <Button className='button__set-up' text={'Set up'} onClick={onClick} />
      <Button className='button__cancel' text={'Cancel'} onClick={onReset} />
    </div>
  );
};
