import {Flex, Box, Text, Button} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import InputField from '@Launch/components/stepTwo/InputField';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import {Projects} from '@Launch/types';
import {useModal} from 'hooks/useModal';
import useTokenAllocation from '@Launch/hooks/useTokenAllocation';

const TopTitle = () => {
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [pricePerTon, setPricePerTon] = useState(values.projectTokenPrice);
  const [salePrice, setSalePrice] = useState(values.projectTokenPrice);

  useEffect(() => {
    setFieldValue('projectTokenPrice', pricePerTon);
    // setFieldValue('tosPrice', pricePerTos);
    /*eslint-disable*/
  }, [pricePerTon]);

  useEffect(() => {
    setFieldValue('salePrice', salePrice);
  }, [salePrice]);

  const {openAnyModal} = useModal();
  const {remaindToken, totalSupply} = useTokenAllocation();

  return (
    <Box px={'35px'} py={'23px'} pos="relative">
      <Flex justifyContent={'space-between'}>
        <StepTitle title={'Vaults'} isSaveButton={false}></StepTitle>
        <Flex>
          <Flex alignItems={'center'} fontSize={12} mr={'25px'}>
            <Text color={'#3a495f'}>Total</Text>
            <Text color={'#86929d'}> / </Text>
            <Text color={'#2a72e5'}>Remained</Text>
            <Text color={'#86929d'}> : </Text>
            <Text color={'#3a495f'}>{totalSupply}</Text>
            <Text color={'#86929d'}> / </Text>
            <Text color={'#2a72e5'}>{remaindToken}</Text>
          </Flex>
          <Button
            w={'120px'}
            h={'38px'}
            fontSize={14}
            color={'white.100'}
            _hover={{}}
            // disabled={isDisable || isSubmitting}
            bg={'blue.500'}
            onClick={() => openAnyModal('Launch_PieChartModal', {})}>
            View Chart
          </Button>
        </Flex>
      </Flex>
      <Flex pos="absolute" left={'127px'} top={'27px'} alignItems="center">
        <Text fontSize={13} mr={'10px'}>
          Exchange Ratio 1TON ={' '}
        </Text>
        <InputField
          w={138}
          h={32}
          fontSize={13}
          value={pricePerTon}
          setValue={setPricePerTon}
          tokenSymbol={values.tokenSymbol}
          decimalLimit={true}></InputField>
        <Text fontSize={13} ml={'20px'} mr={'10px'}>
          Sale Price ={' '}
        </Text>
        <InputField
          w={138}
          h={32}
          fontSize={13}
          value={salePrice}
          setValue={setSalePrice}
          tokenSymbol={'$'}
          decimalLimit={true}></InputField>
      </Flex>
    </Box>
  );
};

export default TopTitle;
