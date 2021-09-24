import {Input, NumberInput, NumberInputField} from '@chakra-ui/react';
import {Dispatch, SetStateAction} from 'react';
import {useTheme} from '@chakra-ui/react';
type LiquidityInputProp = {
  w?: string;
  h?: string;
  balance?: number;
  fontSize?: any;
  value: any;
  setValue: Dispatch<SetStateAction<any>>;
};

export const LiquidityInput = (prop: LiquidityInputProp) => {
  const {w, h, balance, fontSize, value, setValue} = prop;
  const theme = useTheme();
    return (
      <NumberInput
        w={w}
        h={h}
        value={value}
        borderRadius={'7px'}
        border={balance !== undefined && balance < value? '1px solid #e53e3e': 'none'}
        onChange={(value) => setValue(value)}>
        <NumberInputField
          borderWidth={0}
          textAlign={'right'}
          placeholder={'0.00'}
          fontWeight={'bold'}
          keepWithinRange={true}
          w={'100%'}
          h={'100%'}
          fontSize={fontSize}
          p={0}
          _focus={{
            borderWidth: 0,
          }}></NumberInputField>
      </NumberInput>
    );
  }