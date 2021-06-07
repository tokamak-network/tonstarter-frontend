import * as React from 'react';
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react';
import {FaMoon, FaSun} from 'react-icons/fa';

type ThemeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = props => {
  const {toggleColorMode} = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
