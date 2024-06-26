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
  fontSize?: string;
  value: any;
  setValue?: Dispatch<SetStateAction<any>>;
  numberOnly?: boolean;
  maxBtn?: boolean;
  maxValue?: number;
  placeHolder?: string;
  style?: any;
  fontWeight?: number;
  startWithZero?: boolean;
  textAlign?: string;
  error?: boolean
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
    textAlign,
    error
  } = prop;

  useEffect(() => {
    if (setValue && value.length > 1 && value.startsWith('0')) {
      if (startWithZero === true) {
        return;
      }
      setValue(value.slice(1, value.legnth));
    }
    if (setValue && value.split('.')[1] !== undefined) {
      return setValue(
        `${value.split('.')[0]}.${value.split('.')[1].slice(0, 2)}`,
      );
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
        isInvalid={error}
        errorBorderColor='red.300'
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
          return setValue ? setValue(value) : null;
        }}
        pos="relative"
        {...style}>
        <Box
          pos="absolute"
          left={`${
            value.length * 8 + 18.5 < 135 ? value.length * 8 + 18.5 : 135
          }px`}
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
              // if (String(maxValue).split('.')[1]?.length > 2) {
              //   const twoDecimalMaxValue = `${
              //     String(maxValue).split('.')[0]
              //   }.${String(maxValue).split('.')[1].substring(0, 10)}`;
              //   return setValue(twoDecimalMaxValue);
              // }
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
          isInvalid={error}
          errorBorderColor='red.300'
          verticalAlign={'sub'}
          border="none"
          fontWeight={maxBtn === true? 'bold' : 'normal'}
          fontSize={maxBtn === true? '' : '12px'}
          // w={'160px'}
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
      border={
        border || colorMode === 'light'
          ? '1px solid #dfe4ee'
          : '1px solid #424242'
      }
      isInvalid={error}
    errorBorderColor='red.300'
      textAlign={textAlign || 'center'}
      fontWeight={fontWeight || 'bold'}
      w={w}
      h={h}
      value={value}
      onChange={(e: any) => (setValue ? setValue(e.target.value) : null)}
      _focus={{
        border:
          border || colorMode === 'light'
            ? '1px solid #dfe4ee'
            : '1px solid #424242',
        borderWidth: 1,
      }}
      placeholder={placeHolder}
      {...style}
    />
  );
};
