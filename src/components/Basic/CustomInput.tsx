import {
  Input,
  NumberInput,
  NumberInputField,
  useColorMode,
  Text,
  Box,
  Button,
} from '@chakra-ui/react';
import {Dispatch, SetStateAction, useEffect} from 'react';

type CustomInputProp = {
  w?: string;
  h?: string;
  border?: any;
  color?: string;
  br?: number;
  tokenName?: string;
  value: any;
  setValue?: Dispatch<SetStateAction<any>>;
  numberOnly?: boolean;
  maxBtn?: boolean;
  maxValue?: number;
  placeHolder?: string;
  style?: any;
  fontWeight?: number;
  startWithZero?: boolean;
};

export const CustomInput = (prop: CustomInputProp) => {
  const {colorMode} = useColorMode();

  const {
    w,
    h,
    border,
    value,
    setValue,
    numberOnly,
    br,
    color,
    tokenName,
    maxBtn,
    maxValue,
    placeHolder,
    style,
    fontWeight,
    startWithZero,
  } = prop;

  useEffect(() => {
    if (setValue && value.length > 1 && value.startsWith('0')) {
      if (startWithZero === true) {
        return;
      }
      setValue(value.slice(1, value.legnth));
    }
  }, [value, setValue, startWithZero]);

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
        color={color || 'gray.175'}
        value={Number(value) <= 0 ? 0 : value}
        // focusBorderColor="#000000"
        borderRadius={br || 4}
        onChange={(value) => {
          if ((value === '0' || value === '00') && value.length <= 2) {
            return null;
          }
          if (value === '' && setValue) {
            return setValue('0');
          }
          if (value.length > 9) {
            return null;
          }
          return setValue ? setValue(value) : null;
        }}
        pos="relative">
        <Box
          pos="absolute"
          left={`${value.length * 8 + 18.5}px`}
          h={'100%'}
          d="flex"
          pt={'2px'}
          alignItems="center"
          justifyContent="center">
          <Text>{tokenName}</Text>
        </Box>
        {maxBtn === true && maxValue && setValue ? (
          <Button
            zIndex={100}
            pos="absolute"
            right={'3px'}
            w={'50px'}
            h={'26px'}
            mt={'2px'}
            bg={'none'}
            cursor={'pointer'}
            border={
              border || colorMode === 'light'
                ? '1px solid #dfe4ee'
                : '1px solid #424242'
            }
            _hover={{
              border: '1px solid #2a72e5',
            }}
            onClick={() => {
              if (String(maxValue).split('.')[1]?.length > 2) {
                const twoDecimalMaxValue = `${
                  String(maxValue).split('.')[0]
                }.${String(maxValue).split('.')[1].substring(0, 2)}`;
                return setValue(twoDecimalMaxValue);
              }
              setValue(String(maxValue));
            }}>
            Max
          </Button>
        ) : null}
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
      fontWeight={fontWeight || 'bold'}
      w={w}
      h={h}
      value={value}
      onChange={(e: any) => (setValue ? setValue(e.target.value) : null)}
      _focus={{
        borderWidth: 0,
      }}
      placeholder={placeHolder}
      {...style}
    />
  );
};
