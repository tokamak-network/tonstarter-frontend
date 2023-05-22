import React from 'react';
import {Button} from './Button';
import '../styles/clock.scss';

type ActionBarProps = {
  onSet?: () => void;
  onCancel?: () => void;
};

export const ActionBar: React.FC<ActionBarProps> = ({onSet, onCancel}) => {
  return (
    <div className="date-time-selector__actions">
      <Button className="button__set-up" text={'Set up'} onClick={onSet} />
      <Button className="button__cancel" text={'Cancel'} onClick={onCancel} />
    </div>
  );
};
