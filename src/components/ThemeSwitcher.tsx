import * as React from 'react';
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
  useTheme,
} from '@chakra-ui/react';
import {MoonIcon,
  SunIcon} from '@chakra-ui/icons';

type ThemeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = props => {
  const {toggleColorMode, colorMode} = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  const theme = useTheme();

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="unstyled"
      color={colorMode==='light'? theme.colors.gray[275]:theme.colors.white[100]}
      marginLeft="2"
      onClick={toggleColorMode}
      bg={'transparent'}
      icon={<SwitchIcon />}
      _hover={{ color: colorMode==='light'? theme.colors.blue[100]: 'red' }}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
