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
    275: '#222222',
    250: '#3D495D',
    225: '#3E495C',
    200: '#F1F1F3',
    175: '#86929D',
    150: '#7E8993',
    125: '#3A495F',
    100: '#F4F6F9',
    75: '#535353',
    50: '#FAFBFC',
    25: '#E9EDF1',
    10: '#C5D1D9',
    0: '#FFFFFF',
  },
  blue: {
    400: '#0062C2',
    300: '#2A72E5',
    200: '#007AFF',
    100: '#0070ED',
  },
  white: {
    100: '#FFFFFF',
  },
  yellow: {
    300: '#FFC200',
    200: '#FECF05',
    100: '#FFFF07',
  },
};

const theme = extendTheme({
  styles: {
    global: (props) => {
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
          boxShadow: 'none !important',
        },
        '.page-title': {
          color: mode('gray.800', 'gray.300')(props),
        },
        '.dropdown-btn-properties': {
          fontFamily: props.theme.fonts.heading,
          background: mode('gray.0', 'gray.1000')(props),
          color: mode('gray.400', 'gray.300')(props),
        },
        '.dropdown-btn-hint': {
          color: mode('gray.400', 'gray.300')(props),
        },
        '.dropdown-btn': {
          _active: {
            color: mode('gray.400', 'gray.300')(props),
          },
        },
        '.dropdown-btn-unfolded': {
          color: mode('gray.600', 'gray.400')(props),
        },
        '.dropdown-content': {
          background: mode('gray.0', 'gray.1000')(props),
        },
        '.dropdown-item': {
          color: mode('gray.600', 'gray.300')(props),
        },
        '.link': {
          font: fonts.body,
          fontSize: 17,
          fontWeight: 'bold',
          color: mode('gray.1000', 'white.100')(props),
        },
        // '.link:hover': {
        //   color: mode('blue.400','gray.400')(props),
        // },
        '.active': {
          color: mode('blue.100', 'yellow.100')(props),
        },
      };
    },
  },
  colors,
  fonts,
  breakpoints,
});

export default theme;
