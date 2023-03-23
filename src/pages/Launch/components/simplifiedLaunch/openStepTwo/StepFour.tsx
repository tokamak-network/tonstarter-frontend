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

const StepFour = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  console.log('values', values);

  const handleInput = (e: number) => {
    setFieldValue('exchangeRate', e)
  };

  return (
    <Flex flexDir={'column'} h="142px" alignItems={'flex-start'}>
      {' '}
      <Text
        fontSize={'14px'}
        fontWeight={500}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        In order to list on a DEX, you need to set the{' '}
        <span style={{color: '#2a72e5'}}>exchange rate </span>between your
        project token and TOS, which is currently set to match the market price,
        as shown below, but you can change it if you wish.
      </Text>
      <Flex
        h="30px"
        w="130px"
        alignItems={'center'}
        borderRadius="4px"
        bg={colorMode === 'dark' ? 'transparent' : '#f9fafb'}
        border={
          colorMode === 'dark' ? '1px solid #323232' : '1px solid #dfe4ee'
        }
        focusBorderColor={'#dfe4ee'}
        pr="15px"
        fontSize={'13px'}>
        <NumberInput>
          <NumberInputField
            h="30px"
            placeholder={'0'}
            fontSize={'13px'}
            border="none"
            pr="5px"
            textAlign={'right'}
            _focus={{}}
            value={values.exchangeRate}
            onChange={(e) => {
              handleInput(parseInt(e.target.value));
            }}></NumberInputField>
        </NumberInput>
        <Text>TON</Text>
      </Flex>
    </Flex>
  );
};

export default StepFour;
