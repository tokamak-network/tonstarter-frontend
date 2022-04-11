import {Flex, Box, Text, Button} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import InputField from '@Launch/components/stepTwo/InputField';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import {Projects} from '@Launch/types';
import {useModal} from 'hooks/useModal';

const TopTitle = () => {
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [pricePerTon, setPricePerTon] = useState(values.projectTokenPrice);
  const [pricePerTos, setPricePerTos] = useState(values.tosPrice);

  useEffect(() => {
    setFieldValue('projectTokenPrice', pricePerTon);
    setFieldValue('tosPrice', pricePerTos);
    /*eslint-disable*/
  }, [pricePerTon, pricePerTos]);

  const {openAnyModal} = useModal();

  return (
    <Box px={'35px'} py={'23px'} pos="relative">
      <Flex justifyContent={'space-between'}>
        <StepTitle title={'Vaults'} isSaveButton={false}></StepTitle>
          <Button
            w={'120px'}
            h={'38px'}
            fontSize={14}
            color={'white.100'}
            _hover={{}}
            // disabled={isDisable || isSubmitting}
            bg={'blue.500'}
            onClick={() =>
              openAnyModal('Launch_PieChartModal',{})
            }
          >
            View Chart
          </Button>
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
