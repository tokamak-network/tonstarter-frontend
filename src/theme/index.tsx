import {extendTheme} from '@chakra-ui/react';
import {createBreakpoints} from '@chakra-ui/theme-tools';

const fonts = {
};

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const colors = {
    gray: {
      600: '#3e495c',
      500: '#818992',
      400: '#86929d',
      300: '#c9d1d8',
      200: '#dfe4ee',
      100: '#f4f6f9',
    },
    blue: {
      400: '#0062c2',
      300: '#2a72e5',
      200: '#a9c6f4',
      100: '#d9e7f9'
    }
};

const theme = extendTheme({
  colors,
  fonts,
  breakpoints,
});

export default theme;
