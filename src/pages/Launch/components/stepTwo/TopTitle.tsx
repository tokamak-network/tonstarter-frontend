import {Flex, Box, Text} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import InputField from '@Launch/components/stepTwo/InputField';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
const TopTitle = () => {
  const [pricePerTon, setPricePerTon] = useState('0');
  const [pricePerTos, setPricePerTos] = useState('0');
  const {setFieldValue} = useFormikContext();

  useEffect(() => {
    setFieldValue('projectTokenPrice', pricePerTon);
    setFieldValue('tosPrice', pricePerTos);
    /*eslint-disable*/
  }, [pricePerTon, pricePerTos]);

  return (
    <Box px={'35px'} py={'23px'} pos="relative">
      <StepTitle title={'Vaults'} isSaveButton={true}></StepTitle>
      <Flex pos="absolute" left={'127px'} top={'22px'} alignItems="center">
        <Text fontSize={13} mr={'10px'}>
          Exchange Ratio 1TON ={' '}
        </Text>
        <InputField
          w={138}
          h={32}
          fontSize={13}
          value={pricePerTon}
          setValue={setPricePerTon}></InputField>
        <Text fontSize={13} ml={'20px'} mr={'10px'}>
          1TOS ={' '}
        </Text>
        <InputField
          w={138}
          h={32}
          fontSize={13}
          value={pricePerTos}
          setValue={setPricePerTos}></InputField>
      </Flex>
    </Box>
  );
};

export default TopTitle;
