import {extendTheme} from '@chakra-ui/react';
import {createBreakpoints, mode} from '@chakra-ui/theme-tools';
import {Text, TextProps as TextPropsOriginal} from 'rebass';
import '@fontsource/titillium-web/400.css';
import '@fontsource/roboto/400.css';
import '@fontsource/rajdhani/600.css';
import '@fontsource/open-sans';
import '@fontsource/poppins';
import {Colors} from './styled';
import styled from 'styled-components/macro';

type TextProps = Omit<TextPropsOriginal, 'css'>;

const fonts = {
  heading: 'Roboto',
  roboto: 'Roboto',
  body: 'TitilliumWeb, sans-serif',
  titil: 'TitilliumWeb, sans-serif',
  fld: 'Rajdhani, sans-serif',
  openSans: 'Open Sans, sans-serif',
  poppins: 'Poppins',
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
    625: '#c7d1d8',
    600: '#818181',
    575: '#848c98',
    550: '#e6eaee',
    525: '#3f536e',
    500: '#838383',
    475: '#9d9ea5',
    450: '#5b5b5b',
    425: '#949494',
    400: '#808992',
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
    0: '#ffffff',
  },
  blue: {
    500: '#257eee',
    400: '#0062C2',
    300: '#2A72E5',
    200: '#007AFF',
    100: '#0070ED',
  },
  white: {
    300: '#dee4ef',
    200: '#f3f4f1',
    100: '#FFFFFF',
  },
  black: {
    400: '#2d3136',
    300: '#304156',
    200: '#222222',
  },
  yellow: {
    300: '#ffc200',
    200: '#fecf05',
    100: '#ffff07',
  },
  green: {
    100: '#36af47',
  },
  orange: {
    100: '#f7981c',
  },
  red: {
    100: '#ff3b3b',
  },
};

interface REWARD_PROP {
  colorMode: 'light' | 'dark';
  fontSize?: number;
}
interface MENU_PROPS {
  colorMode: 'light' | 'dark';
}
export const MENU_STYLE = {
  buttonStyle: (props: MENU_PROPS) => ({
    mr: '10px',
    padding: '10px',
    borderRadius: '4px',
    h: '32px',
    color: props.colorMode === 'light' ? '#3e495c' : '#f3f4f1',
    fontSize: '12px',
    w: '157px',
  }),
  buttonTextStyle: (props: MENU_PROPS) => ({
    w: '100%',
    display: 'flex',
    flexDir: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  menuListStyle: (props: MENU_PROPS) => ({
    zIndex: 10000,
    m: '0px',
    minWidth: '155px',
    background: props.colorMode === 'light' ? '#ffffff' : '#222222',
  }),
  menuItemStyle: (props: MENU_PROPS) => ({
    h: '30px',
    color: props.colorMode === 'light' ? '#3e495c' : '#f3f4f1',
    fontSize: '12px',
    w: '155px',
    m: '0px',
    _hover: {background: 'transparent', color: 'blue.100'},
    _focus: {background: 'transparent'},
  }),
};

// props.isUserTier === true
//   ? '1px solid #0070ED'

export const bgStyle = {
  containerStyle: (props: STATER_PROP & {isUserTier?: boolean}) => ({
    bg: props.colorMode === 'light' ? 'white.100' : '',
    borderRadius: 15,
    boxShadow: '0 2px 5px 0 rgba(61, 73, 93, 0.1)',
    border: props.colorMode === 'light' ? '' : '1px solid #535353',
    fontFamily: fonts.roboto,
  }),
};

export const REWARD_STYLE = {
  containerStyle: (props: REWARD_PROP & {isUserTier?: boolean}) => ({
    w: 390,
    h: 272,
    px: '20px',
    pt: '20px',
    pb: 25,
    bg: props.colorMode === 'light' ? 'white.100' : '',
    borderRadius: 15,
    boxShadow: '0 2px 5px 0 rgba(61, 73, 93, 0.1)',
    border: props.colorMode === 'light' ? '' : '1px solid #535353',
    // _hover: {border: 'solid 1px #0070ed'},
    // cursor: 'pointer',
    fontFamily: fonts.fld,
  }),
  header: (props: REWARD_PROP) => ({
    fontSize: props.fontSize || 32,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.250' : 'white.100',
  }),
  mainText: (props: REWARD_PROP) => ({
    fontSize: props.fontSize || 20,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.375' : 'white.100',
  }),
  subText: (props: REWARD_PROP) => ({
    fontSize: props.fontSize || 14,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.150' : 'white.100',
  }),
  subTextBlack: (props: REWARD_PROP) => ({
    fontSize: props.fontSize || 14,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.125' : 'white.300',
  }),
  joinedText: (props: REWARD_PROP) => ({
    fontSize: props.fontSize || 11,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'black.300' : 'white.300',
  }),
  progress: {
    mainText: (props: REWARD_PROP) => ({
      fontSize: props.fontSize || 15,
      fontWeight: 600,
      color: props.colorMode === 'light' ? 'gray.525' : 'white.100',
    }),
    subText: (props: REWARD_PROP) => ({
      fontSize: props.fontSize || 12,
      color: props.colorMode === 'light' ? 'gray.125' : 'gray.475',
    }),
    percent: () => ({
      fontSize: 12,
      color: 'blue.100',
    }),
  },
  btn: (props: REWARD_PROP & {isActive: boolean}) => ({
    bg: '',
    _hover: '',
    p: 0,
    textAlign: 'center',
    verticalAlign: 'center',
    fontSize: 17,
    borderRadius: 0,
    paddingBottom: props.isActive ? '' : '1px',
    color: props.isActive ? '#0070ed' : '#90a5b9',
    borderBottom: props.isActive ? '2px solid #0070ed' : '1px solid #c5d1d9',
  }),
  table: {
    container: (props: REWARD_PROP & {isLast: boolean}) => ({
      borderBottom:
        props?.isLast === true
          ? ''
          : props.colorMode === 'light'
          ? '1px solid #f4f6f8'
          : '1px solid #323232',
    }),
  },
};
interface STATER_PROP {
  colorMode: 'light' | 'dark';
  fontSize?: number;
}
export const STATER_STYLE = {
  containerStyle: (props: STATER_PROP & {isUserTier?: boolean}) => ({
    w: 378,
    h: 295,
    px: 25,
    pt: '20px',
    pb: 25,
    bg: props.colorMode === 'light' ? 'white.100' : '',
    borderRadius: 15,
    boxShadow: '0 2px 5px 0 rgba(61, 73, 93, 0.1)',
    border: props.isUserTier
      ? '1px solid #0070ED'
      : props.colorMode === 'light'
      ? ''
      : '1px solid #535353',
    _hover: {border: 'solid 1px #0070ed'},
    cursor: 'pointer',
    fontFamily: fonts.fld,
  }),
  header: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 32,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.250' : 'white.100',
  }),
  mainText: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 28,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.375' : 'white.100',
  }),
  subText: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 14,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.150' : 'white.100',
  }),
  subTextBlack: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 14,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.125' : 'white.100',
  }),
  progress: {
    mainText: (props: STATER_PROP) => ({
      fontSize: props.fontSize || 15,
      fontWeight: 600,
      color: props.colorMode === 'light' ? 'gray.525' : 'white.100',
    }),
    percent: (props: STATER_PROP & {isZero: boolean}) => ({
      fontSize: 13,
      fontWeight: 600,
      color:
        props.colorMode === 'light'
          ? props.isZero === true
            ? 'gray.150'
            : 'blue.100'
          : props.isZero === true
          ? 'white.100'
          : '',
    }),
  },
  btn: (props: STATER_PROP & {isActive: boolean}) => ({
    bg: '',
    _hover: '',
    p: 0,
    textAlign: 'center',
    verticalAlign: 'center',
    fontSize: 17,
    borderRadius: 0,
    paddingBottom: props.isActive ? '' : '1px',
    color: props.isActive ? '#0070ed' : '#90a5b9',
    borderBottom: props.isActive ? '2px solid #0070ed' : '1px solid #c5d1d9',
  }),
  table: {
    container: (props: STATER_PROP & {isLast: boolean}) => ({
      borderBottom:
        props?.isLast === true
          ? ''
          : props.colorMode === 'light'
          ? '1px solid #f4f6f8'
          : '1px solid #323232',
    }),
  },
};

export const MOBILE_STATER_STYLE = {
  containerStyle: (props: STATER_PROP & {isUserTier?: boolean}) => ({
    w: 320,
    h: 194,
    px: '20px',
    pt: '20px',
    pb: '20px',
    bg: props.colorMode === 'light' ? 'white.100' : '',
    borderRadius: 15,
    boxShadow: '0 2px 5px 0 rgba(61, 73, 93, 0.1)',
    border: props.isUserTier
      ? '1px solid #0070ED'
      : props.colorMode === 'light'
      ? ''
      : '1px solid #535353',
    _hover: {border: 'solid 1px #0070ed'},
    cursor: 'pointer',
    fontFamily: fonts.fld,
  }),
  header: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 32,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.250' : 'white.100',
  }),
  mainText: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 20,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.375' : 'white.100',
  }),
  subText: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 14,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.150' : 'white.100',
  }),
  subTextBlack: (props: STATER_PROP) => ({
    fontSize: props.fontSize || 14,
    fontWeight: 600,
    color: props.colorMode === 'light' ? 'gray.125' : 'white.100',
  }),
  progress: {
    mainText: (props: STATER_PROP) => ({
      fontSize: props.fontSize || 15,
      fontWeight: 600,
      color: props.colorMode === 'light' ? 'gray.525' : 'white.100',
    }),
    percent: (props: STATER_PROP & {isZero: boolean}) => ({
      fontSize: 13,
      fontWeight: 600,
      color:
        props.colorMode === 'light'
          ? props.isZero === true
            ? 'gray.150'
            : 'blue.100'
          : props.isZero === true
          ? 'white.100'
          : '',
    }),
  },
  btn: (props: STATER_PROP & {isActive: boolean}) => ({
    bg: '',
    _hover: '',
    p: 0,
    textAlign: 'center',
    verticalAlign: 'center',
    fontSize: 17,
    borderRadius: 0,
    paddingBottom: props.isActive ? '' : '1px',
    color: props.isActive ? '#0070ed' : '#90a5b9',
    borderBottom: props.isActive ? '2px solid #0070ed' : '1px solid #c5d1d9',
  }),
  table: {
    container: (props: STATER_PROP & {isLast: boolean}) => ({
      borderBottom:
        props?.isLast === true
          ? ''
          : props.colorMode === 'light'
          ? '1px solid #f4f6f8'
          : '1px solid #323232',
    }),
  },
};

const TextWrapper = styled(Text)<{color: keyof Colors}>`
  color: ${({color, theme}) => (theme as any)[color]};
`;

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />;
  },
  label(props: TextProps) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />;
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />;
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />;
  },
  body(props: TextProps) {
    return (
      <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
    );
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />;
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />;
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow3'} {...props} />;
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />;
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />;
  },
  italic(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        fontSize={12}
        fontStyle={'italic'}
        color={'text2'}
        {...props}
      />
    );
  },
  error({error, ...props}: {error: boolean} & TextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        color={error ? 'red1' : 'text2'}
        {...props}
      />
    );
  },
};

const headerMargin = {
  mt: '72px',
};

const btnHover = {
  backgroundColor: 'blue.100',
  checkDisable: (props: any) => ({
    bg: props.signIn ? 'blue.100' : {},
  }),
};

const btnStyle = {
  btnAble: () => ({
    bg: 'blue.500',
    color: 'white.100',
    _hover: {backgroundColor: 'blue.100'},
  }),
  btnDisable: (props: any) => ({
    bg: props.colorMode === 'light' ? 'gray.25' : '#353535',
    color: props.colorMode === 'light' ? 'gray.175' : 'gray.500',
    fontWeight: props.colorMode === 'light' ? 'bold' : '',
    // borderWidth: props.colorMode === 'light' ? 0 : 1,
    borderColor: props.colorMode === 'light' ? '' : 'gray.450',
    _hover: {},
  }),
};

const modalStyle = {
  modalContent: (props: any) => ({
    fontFamily: fonts.roboto,
    bg: props.colorMode === 'light' ? 'white.100' : 'black.200',
    w: '350px',
    pt: '25px',
    pb: '25px',
  }),
  box: (props: any) => ({
    pb: '1.250em',
    borderBottom:
      props.colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737',
  }),
  head: (props: any) => ({
    fontSize: '1.250em',
    fontWeight: 'bold',
    fontFamily: fonts.titil,
    color: props.colorMode === 'light' ? 'gray.250' : 'white.100',
    textAlign: 'center',
  }),
  headText: {
    color: 'gray.175',
    fontSize: '0.750em',
    textAlign: 'center',
  },
  stack: (props: any) => ({
    as: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom:
      props.colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737',
  }),
  button: {
    w: '9.375em',
    bg: 'blue.500',
    color: 'white.100',
    fontSize: '0.875em',
    fontWeight: 300,
    _hover: {},
  },
  fontColor: (props: any) => ({
    color: props.colorMode === 'light' ? 'black.300' : 'white.100',
  }),
  fontSubColor: (props: any) => ({
    color: props.colorMode === 'light' ? 'gray.250' : 'white.200',
  }),
};

const OpenCampaginDesign = {
  border: (props: any) => ({
    border:
      props.colorMode === 'light' ? 'solid 1px #e6eaee' : 'solid 1px #323232',
    borderRadius: 10,
  }),
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
          boxShadow: 'none !important',
        },
        '.page-title': {
          color: mode('gray.200', 'gray.150')(props),
        },
        '.dropdown-btn-properties': {
          fontFamily: props.theme.fonts.heading,
          background: mode('gray.0', 'gray.275')(props),
          color: mode('gray.175', 'gray.125')(props),
        },
        '.dropdown-btn-hint': {
          color: mode('gray.175', 'gray.125')(props),
        },
        '.dropdown-btn': {
          _active: {
            color: mode('gray.175', 'gray.125')(props),
          },
        },
        '.dropdown-btn-unfolded': {
          color: mode('gray.200', 'gray.175')(props),
        },
        '.dropdown-content': {
          background: mode('gray.0', 'gray.275')(props),
        },
        '.dropdown-item': {
          color: mode('gray.200', 'gray.125')(props),
        },
        '.link': {
          font: fonts.body,
          fontSize: 17,
          fontWeight: 'bold',
          color: mode('gray.275', 'white.100')(props),
        },
        '.link-match': {
          font: fonts.body,
          fontSize: 17,
          fontWeight: 'bold',
          color: mode('gray.0', 'white.100')(props),
        },
        '.fld-text1': {
          fontFamily: props.theme.fonts.fld,
          fontWeight: '400',
          fontSize: 16,
          color: props.theme.colors.gray[150],
        },
        '.fld-text2': {
          fontFamily: props.theme.fonts.fld,
          fontWeight: 'semibold',
          fontSize: 16,
          color: mode('gray.125', 'white.100')(props),
        },
        // '.link:hover': {
        //   color: mode('blue.175','gray.175')(props),
        // },
        '.active': {
          color: mode('blue.100', 'yellow.100')(props),
        },
        '.active-fld': {
          color: 'yellow.100',
        },
        '.header': {
          bg: mode(
            props.theme.colors.blue[200],
            props.theme.colors.gray[275],
          )(props),
        },
      };
    },
  },
  colors,
  fonts,
  breakpoints,
  modalStyle,
  btnHover,
  btnStyle,
  headerMargin,
  REWARD_STYLE,
  STATER_STYLE,
  MOBILE_STATER_STYLE,
  bgStyle,
  MENU_STYLE,
  OpenCampaginDesign,
});

export default theme;
