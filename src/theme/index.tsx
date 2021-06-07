import {extendTheme} from '@chakra-ui/react';
import {createBreakpoints, mode} from '@chakra-ui/theme-tools';
import '@fontsource/titillium-web/400.css';
import '@fontsource/roboto/400.css';
import '@fontsource/rajdhani/600.css'

const fonts = {
  heading: 'Roboto',
  body: 'TitilliumWeb, sans-serif',
  fld: 'Rajdhani, sans-serif',
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
    375: '#353c48',
    350: '#9f9f9f',
    325: '#e9e9ec',
    300: '#d7d9df',
    275: '#222222',
    250: '#3d495d',
    225: '#3e495c',
    200: '#f1f1f3',
    175: '#86929d',
    150: '#7e8993',
    125: '#3a495f',
    100: '#f4f6f9',
    75: '#535353',
    50: '#fafbfc',
    25: '#e9edf1',
    10: '#c5d1d9',
    0: '#ffffff'
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
    300: '#ffc200',
    200: '#fecf05',
    100: '#ffff07'
  }
};

const theme = extendTheme({
  
  styles: {
    global: (props) => {
      
      return {
      body: {
        bgColor: mode('gray.50', 'gray.275')(props),
      },
      // a: {
      //   textDecoration: 'none',
      //   _hover: {
      //     color: 'blue.300',
      //   },
      //   a: {
      //     textDecoration: 'none',
      //     _hover: {
      //       color: 'blue.300',
      //     },
      //     _active: {
      //       color: 'blue.300',
      //     },
      //   },
      // },
      button: {
        bg: 'transparent',
        boxShadow: 'none !important'
      },
      '.page-title': {
        color:mode('gray.200','gray.150')(props),
      },
      '.dropdown-btn-properties': {
        fontFamily: props.theme.fonts.heading,
        background: mode('gray.0','gray.275')(props),
        color:mode('gray.175','gray.125')(props),
      },
      '.dropdown-btn-hint': {
        color: mode('gray.175','gray.125')(props),
      },
      '.dropdown-btn': {
        _active: { 
          color:mode('gray.175','gray.125')(props),}
      },
      '.dropdown-btn-unfolded': {
        color: mode('gray.200','gray.175')(props),
      },
      '.dropdown-content': {
        background: mode('gray.0','gray.275')(props),
      },
      '.dropdown-item': {
        color: mode('gray.200','gray.125')(props),
      },
      '.link': {
        font: fonts.body,
        fontSize: 17,
        fontWeight: 'bold',
        color: mode('gray.275','white.100')(props),
      },
      '.link-match': {
        font: fonts.body,
        fontSize: 17,
        fontWeight: 'bold',
        color: mode('gray.0','white.100')(props),
      },
      '.fld-text1': {
        fontFamily: props.theme.fonts.fld,
        fontWeight: '400',
        fontSize: 16, 
        color: props.theme.colors.gray[150]
      },
      '.fld-text2': {
        fontFamily: props.theme.fonts.fld,
        fontWeight: 'semibold',
        fontSize: 16, 
        color: mode('gray.125','white.100')(props),
      },
      // '.link:hover': {
      //   color: mode('blue.175','gray.175')(props),
      // },
      '.active': {
        color: mode('blue.100','yellow.100')(props),
      },
      '.active-fld': {
        color: 'yellow.100'
      },
      '.header': {
        bg: mode(props.theme.colors.blue[200],props.theme.colors.gray[275])(props)
      }
    }
  }, 

  },
  colors,
  fonts,
  breakpoints,
});

export default theme;