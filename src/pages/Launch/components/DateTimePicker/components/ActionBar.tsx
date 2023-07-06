import React from 'react';
import {Button} from './Button';
import '../styles/clock.scss';
import {useColorMode} from '@chakra-ui/react';

type ActionBarProps = {
  onSet?: () => void;
  onCancel?: () => void;
};

export const ActionBar: React.FC<ActionBarProps> = ({onSet, onCancel}) => {
  const {colorMode} = useColorMode();

  return (
    <div
      className={`date-time-selector__actions${
        colorMode === 'light' ? '--light-mode' : '--dark-mode'
      }`}>
      <Button className="button__set-up" text={'Set up'} onClick={onSet} />
      <Button className="button__cancel" text={'Cancel'} onClick={onCancel} />
    </div>
  );
};
