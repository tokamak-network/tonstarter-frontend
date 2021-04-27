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
  colors: {
    gray: {
    
    }
  }
};

const theme = extendTheme({
  colors,
  fonts,
  breakpoints,
});

export default theme;
