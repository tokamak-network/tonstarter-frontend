import {Button} from '@chakra-ui/react';

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
  } = props;

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
      isDisabled={isDisabled}
      disabled={disabled}
      bg={bgColor}
      borderRadius={4}
      _hover={{}}
      fontSize={14}
      onClick={onClick}>
      {btnText}
    </Button>
  );
};
