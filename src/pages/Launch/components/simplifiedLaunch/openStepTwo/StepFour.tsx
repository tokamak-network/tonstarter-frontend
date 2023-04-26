import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import truncNumber from 'utils/truncNumber';
const StepFour = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const [focus, setFocus] = useState(false);

  const handleInput = (e: number) => {
    setFieldValue('tosPrice', truncNumber(1 / e, 3));
  };

  const getZeros = (num: number) => {
    const match = num.toString().match(/\.0*(.*)/);
    if (match && match[1] && num > 0) {
      const numZeros = num.toString().length - 1 - match[1].length;
      return numZeros;
      // return zeros; // Output:
    } else {
      return 0;
    }
  };

  return (
    <Flex flexDir={'column'} alignItems={'flex-start'} h="150px">
      {' '}
      <Text
        fontSize={'14px'}
        fontWeight={'bold'}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        In order to list on a DEX, you need to set the{' '}
        <span style={{color: '#2a72e5'}}>exchange rate </span>between your
        project token and TOS, which is currently set to match the market price,
        as shown below, but you can change it if you wish.
      </Text>
      <Flex
        fontSize={'14px'}
        alignItems={'center'}
        color={'#7e8993'}
        fontWeight={500}>
        <Text>
          {' '}
          1 {values.tokenSymbol} ={' '}
          {(1 / values.projectTokenPrice).toLocaleString()}TON ={' '}
        </Text>
        <Flex
          h="30px"
          w="130px"
          ml={'6px'}
          alignItems={'center'}
          borderRadius="4px"
          bg={values.vaults[0].isSet? colorMode === 'dark' ? 'transparent' : '#e9edf1': 'transparent'}
          border={
            focus
              ? '1px solid #2a72e5'
              : colorMode === 'dark'
              ? '1px solid #424242'
              : '1px solid #dfe4ee'
          }
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          pr="15px"
          fontSize={'13px'}>
          <NumberInput
            isDisabled={values.vaults[0].isSet}
            _disabled={{color:colorMode === 'dark'?"#484848":'#8f96a1'}}
            color={colorMode === 'dark' ? '#f3f4f1' : '#3e495c'}>
            <NumberInputField
              h="30px"
              
              placeholder={
                values.tosPrice
                  ? (1 / values.tosPrice)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: getZeros(1 / values.tosPrice),
                      })
                      .toString()
                  : '0'
              }
              _placeholder={{
                color:  colorMode === 'dark' ? '#f3f4f1' : '#3e495c',
              }}
              fontSize={'13px'}
              border="none"
              pr="5px"
              textAlign={'right'}
              _focus={{}}
              value={values.tosPrice ? 1 / values.tosPrice : '0'}
              onChange={(e) => {
                handleInput(parseInt(e.target.value));
              }}></NumberInputField>
          </NumberInput>
          <Text cursor={values.vaults[0].isSet? 'not-allowed':''} color={values.vaults[0].isSet?colorMode === 'dark'?"#484848":'#8f96a1': colorMode === 'dark' ? '#f3f4f1' : '#3e495c'}>TOS</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StepFour;
