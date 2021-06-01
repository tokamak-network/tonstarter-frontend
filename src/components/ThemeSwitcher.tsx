import * as React from 'react';
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
  useTheme,
} from '@chakra-ui/react';
import {FaMoon, FaSun} from 'react-icons/fa';

type ThemeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = props => {
  const {toggleColorMode, colorMode} = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const theme = useTheme();

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color={colorMode==='light'? theme.colors.gray[1000]:theme.colors.white[100]}
      marginLeft="2"
      onClick={toggleColorMode}
      bg={'transparent'}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
