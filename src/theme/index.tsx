import {extendTheme} from '@chakra-ui/react';
import {createBreakpoints} from '@chakra-ui/theme-tools';

const fonts = {};

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const colors = {
    gray: {
      700: '#3e495c',
      600: '#818992',
      500: '#86929d',
      400: '#c9d1d8',
      300: '#dfe4ee',
      200: '#f4f6f9',
      100: '#fafbfc'
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
