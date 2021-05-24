import {extendTheme} from '@chakra-ui/react';
import {createBreakpoints, mode} from '@chakra-ui/theme-tools';

import '@fontsource/titillium-web/200.css';
import '@fontsource/roboto/400.css';

const fonts = {
  heading: 'Roboto',
  body: 'TitilliumWeb, sans-serif',
};

const breakpoints = createBreakpoints({
  xs: '5em',
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const colors = {
  gray: {
    1000: '#4c576a',
    900: '#304156',
    800: '#3d495d',
    700: '#808992',
    600: '#3e495c',
    500: '#818992',
    400: '#86929d',
    300: '#c9d1d8',
    200: '#dfe4ee',
    100: '#f4f6f9',
    50: '#fafbfc',
    25: '#e9edf1',
    0: '#ffffff'
  },
  blue: {
    400: '#0062c2',
    300: '#2a72e5',
    200: '#a9c6f4',
    100: '#d9e7f9',
  },
  white: {
    100:  '#ffffff'
  }
};

const theme = extendTheme({
  styles: {
    global: props => {
      return {
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
      '.page-title': {
        color:mode('gray.800','gray.300')(props),
      },
      '.dropdown-btn-properties': {
        fontFamily: props.theme.fonts.heading,
        background: mode('gray.0','gray.1000')(props),
        color:mode('gray.400','gray.300')(props),
      },

      '.dropdown-btn-hint': {
        color: mode('gray.400','gray.300')(props),
      },
      '.dropdown-btn': {
        _active: { 
          color:mode('gray.400','gray.300')(props),}
      },
      '.dropdown-btn-unfolded': {
        color: mode('gray.600','gray.400')(props),
      },
      '.dropdown-content': {
        background: mode('gray.0','gray.1000')(props),
      },
      '.dropdown-item': {
        color: mode('gray.600','gray.300')(props),
      }
    }
  },
  },
  colors,
  fonts,
  breakpoints,
});

export default theme;
