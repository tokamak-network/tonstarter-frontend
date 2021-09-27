import {Button, useColorMode, useTheme} from '@chakra-ui/react';

type CustomButtonProp = {
  text: string;
  w?: string;
  h?: string;
  fontSize?: number;
  isDisabled?: boolean;
  func?: () => void;
};

export const CustomButton = (prop: CustomButtonProp) => {
  const {text, w, h, isDisabled, fontSize, func} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Button
      w={w || '150px'}
      h={h || '38px'}
      bg={'blue.500'}
      color={'#ffffff'}
      fontSize={fontSize || 14}
      isDisabled={isDisabled}
      _hover={{}}
      onClick={() => func}>
      {text}
    </Button>
  );
};
