import {extendTheme} from '@chakra-ui/react';
import {createBreakpoints, mode} from '@chakra-ui/theme-tools';

import '@fontsource/titillium-web/400.css';
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
    1000: '#222222',
    900: '#3d495d',
    800: '#86929d',
    700: '#3e495c',
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
    200: '#007aff',
    100: '#0070ed',
  },
  white: {
    100:  '#ffffff'
  }, 
  yellow: {
    100: '#ffff07'
  }
};

const theme = extendTheme({
  styles: {
    global: props => {
      return {
      body: {
        bgColor: mode('gray.50', 'gray.1000')(props),
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
      button: {
        bg: 'transparent',
        boxShadow: 'none !important'
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
      },
      '.link': {
        font: fonts.body,
        fontSize: 17,
        fontWeight: 'bold',
        color: mode('gray.1000','white.100')(props),
      },
      // '.link:hover': {
      //   color: mode('blue.400','gray.400')(props),
      // },
      '.active': {
        color: mode('blue.100','yellow.100')(props),
      }
    }
  }, 

  },
  colors,
  fonts,
  breakpoints,
});

export default theme;
