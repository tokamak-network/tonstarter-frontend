import {Input, NumberInput, NumberInputField} from '@chakra-ui/react';
import {Dispatch, SetStateAction} from 'react';

type CustomInputProp = {
  w?: string;
  h?: string;
  border?: any;
  value: any;
  setValue: Dispatch<SetStateAction<any>>;
  numberOnly?: boolean;
};

export const CustomInput = (prop: CustomInputProp) => {
  const {w, h, border, value, setValue, numberOnly} = prop;
  if (numberOnly) {
    return (
      <NumberInput
        w={w}
        h={h}
        value={value}
        onChange={(value) => setValue(value)}>
        <NumberInputField
          variant={'outline'}
          borderWidth={0}
          border={border}
          textAlign={'center'}
          fontWeight={'bold'}
          w={'100%'}
          h={'100%'}
          p={0}
          _focus={{
            borderWidth: 0,
          }}></NumberInputField>
      </NumberInput>
    );
  }
  return (
    <Input
      variant={'outline'}
      borderWidth={0}
      border={border}
      textAlign={'center'}
      fontWeight={'bold'}
      w={w}
      h={h}
      value={value}
      onChange={(e: any) => setValue(e.target.value)}
      _focus={{
        borderWidth: 0,
      }}
    />
  );
};
