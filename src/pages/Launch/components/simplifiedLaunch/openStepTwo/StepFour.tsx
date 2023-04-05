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
    const [focus,setFocus] = useState(false)

  const handleInput = (e: number) => {
    
    setFieldValue('tosPrice',truncNumber(1/e,2))
  };
  
  return (
    <Flex flexDir={'column'} mb={'15px'} alignItems={'flex-start'}>
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

      <Flex fontSize={'14px'}  alignItems={'center'}  color={'#7e8993'} fontWeight={500}>
      <Text> 1 {values.tokenSymbol} = {(1/values.projectTokenPrice).toLocaleString()}TON = {' '}</Text>
      <Flex
        h="30px"
        w="130px"
        ml={'6px'}
        alignItems={'center'}
        borderRadius="4px"
        bg={ 'transparent'}
        border={
          focus? '1px solid #2a72e5':  colorMode === 'dark' ? '1px solid #424242' : '1px solid #dfe4ee'
       }
       onFocus={()=> setFocus(true)}
       onBlur={()=> setFocus(false)}
        pr="15px"
        fontSize={'13px'}>
        <NumberInput>
          <NumberInputField
            h="30px"
            placeholder={values.tosPrice? (1/values.tosPrice).toLocaleString().toString() : '0'}
            fontSize={'13px'}
            border="none"
            pr="5px"
            textAlign={'right'}
            _focus={{}}
            value={values.tosPrice? (1/values.tosPrice).toLocaleString(): '0'}
            onChange={(e) => {
              handleInput(parseInt(e.target.value));
            }}></NumberInputField>
        </NumberInput>
        <Text>TOS</Text>
      </Flex>
      </Flex>
      
     
    </Flex>
  );
};

export default StepFour;
