import {extendTheme} from '@chakra-ui/react';
import {createBreakpoints, mode} from '@chakra-ui/theme-tools';

import '@fontsource/titillium-web/200.css';
import '@fontsource/roboto/700.css';

const fonts = {
  heading: 'Roboto',
  body: 'TitilliumWeb, sans-serif',
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
    50: '#fafbfc',
  },
  blue: {
    400: '#0062c2',
    300: '#2a72e5',
    200: '#a9c6f4',
    100: '#d9e7f9',
  },
};

const theme = extendTheme({
  styles: {
    global: props => ({
      body: {
        bgColor: mode('gray.50', 'gray.800')(props),
      },
      a: {
        textDecoration: 'none',
        _hover: {
          color: 'blue.300',
        },
        _active: {
          color: 'blue.300',
        },
      },
      '.link': {
        fontWeight: 700,
        fontSize: props.theme.fontSizes.sm,
        fontFamily: props.theme.fonts.heading,
      },
      '.active': {
        color: props.theme.colors.blue[300],
      },
    }),
  },
  colors,
  fonts,
  breakpoints,
});

export default theme;
