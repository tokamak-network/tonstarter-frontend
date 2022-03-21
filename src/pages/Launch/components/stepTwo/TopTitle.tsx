import {Flex, Box, Text} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import InputField from '@Launch/components/stepTwo/InputField';
import {useState} from 'react';
const TopTitle = () => {
  const [pricePerTon, setPricePerTon] = useState('0');
  const [pricePerTos, setPricePerTos] = useState('0');
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
          setValue={setPricePerTon}></InputField>
        <Text fontSize={13} ml={'20px'} mr={'10px'}>
          1TOS ={' '}
        </Text>
        <InputField
          w={138}
          h={32}
          fontSize={13}
          setValue={setPricePerTos}></InputField>
      </Flex>
    </Box>
  );
};

export default TopTitle;
