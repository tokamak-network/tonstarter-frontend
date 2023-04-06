import {Button, useColorMode} from '@chakra-ui/react';

type ButtonProps = {
  bgColor: string;
  isDisabled?: boolean;
  btnText: string;
  color: string;
  onClick?: any;
  onHover?:any;
  marginRight?: string;
  marginLeft?: string;
  marginTop?: string;
  marginBottom?: string;
  disabled?: boolean;
  hoverColor?: string;
};

export const ActionButton: React.FC<ButtonProps> = (props: any) => {
  const {
    onClick,
    bgColor,
    btnText,
    isDisabled,
    color,
    marginRight,
    marginLeft,
    marginTop,
    marginBottom,
    disabled,
    hoverColor,
  } = props;
  const {colorMode} = useColorMode();
  
  return (
    <Button
      type="submit"
      w={'160px'}
      h={'45px'}
      mr={marginRight}
      ml={marginLeft}
      mt={marginTop}
      mb={marginBottom}
      color={color}
      // _focus={{bg: '#2a72e5'}}
      _active={!disabled? {bg: bgColor === '#00c3c4'? '#00c3c4':bgColor === '#fecf05'?'#fecf05': '#2a72e5'}:{}}
      isDisabled={disabled}
      // disabled={isDisabled}
      _disabled={{bg: colorMode === 'dark'?'#353535':'#e9edf1', color: colorMode === 'dark'? '#838383':'#86929d', cursor:'not-allowed'}}
      bg={bgColor}
      borderRadius={4}
      _hover={{bg: hoverColor}}
      fontSize={14}
      onClick={onClick}>
      {btnText}
    </Button>
  );
};
