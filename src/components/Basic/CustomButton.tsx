import {Button, useColorMode, useTheme, Tooltip, Image} from '@chakra-ui/react';
import tooltipIcon from 'assets/svgs/tooltip_icon_white.svg';
import tooltipIconGray  from 'assets/svgs/input_question_icon.svg'
type CustomButtonProp = {
  text: string;
  w?: string;
  h?: string;
  fontSize?: number;
  isDisabled?: boolean;
  func?: any;
  bg?: string;
  style?: any;
  onSubmit?: any;
  tooltip?: string;
  bgBlue?: boolean
};

export const CustomButton = (prop: CustomButtonProp) => {
  const {text, w, h, isDisabled, fontSize, func, style, onSubmit, tooltip,bgBlue} =
    prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {btnStyle} = theme;
  return (
    <Button
      {...(isDisabled
        ? {...btnStyle.btnDisable({colorMode})}
        : {...btnStyle.btnAble()})}
      {...style}
      _hover={{}}
      _active={{}}
      onSubmit={onSubmit}
      w={w || '150px'}
      h={h || '38px'}
      fontSize={fontSize || 14}
      isDisabled={isDisabled}
      onClick={func}
      textAlign={'center'}
      lineHeight={h || '38px'}>
     

      {text}
      {tooltip && (
        <Tooltip
          label={tooltip}
          hasArrow
          fontSize='12px'
          placement="top"
          w='250px'
          color={colorMode === 'light' ? '#e6eaee' : '#424242'}
          aria-label={'Tooltip'}
          textAlign={'center'}
          size={'xs'}>
          <Image  ml='10px' src={bgBlue? tooltipIcon:tooltipIconGray} />
        </Tooltip>
      )}
    </Button>
  );
};
