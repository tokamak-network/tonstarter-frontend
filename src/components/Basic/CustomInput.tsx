import {
  Input,
  NumberInput,
  NumberInputField,
  useColorMode,
} from '@chakra-ui/react';
import {Dispatch, SetStateAction, useEffect} from 'react';

type CustomInputProp = {
  w?: string;
  h?: string;
  border?: any;
  br?: number;
  value: any;
  setValue: Dispatch<SetStateAction<any>>;
  numberOnly?: boolean;
};

export const CustomInput = (prop: CustomInputProp) => {
  const {colorMode} = useColorMode();
  const format = (val: any, setValue: SetStateAction<any>) => {
    // if (val === '') {
    //   return setValue(0);
    // }
    return val + 'TON';
  };

  const {w, h, border, value, setValue, numberOnly, br} = prop;

  useEffect(() => {
    if (value === '-9007199254740991') {
      setValue(0);
    }
  }, [value, setValue]);

  if (numberOnly) {
    return (
      <NumberInput
        w={w}
        h={h}
        border={
          border || colorMode === 'light'
            ? '1px solid #dfe4ee'
            : '1px solid #424242'
        }
        color={'gray.175'}
        value={format(value, setValue)}
        // focusBorderColor="#000000"
        borderRadius={br || 4}
        onChange={(value) => setValue(value)}>
        <NumberInputField
          // onSelect={(e: any) => {
          //   e.target.style.color = '#3e495c';
          //   e.target.style.border = '1px solid #2a72e5';
          // }}
          border="none"
          fontWeight={'bold'}
          w={'100%'}
          h={'100%'}
          pl={'15px'}
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
