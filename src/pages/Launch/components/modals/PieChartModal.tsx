import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Box,
    Heading,
    Text,
    Button,
    Flex,
    useTheme,
    useColorMode,
    Input,
  } from '@chakra-ui/react';
  import React, {useEffect, useState} from 'react';
  import {useAppSelector} from 'hooks/useRedux';
  import {selectModalType} from 'store/modal.reducer';
  import {useModal} from 'hooks/useModal';
  import {CloseButton} from 'components/Modal';
  import {Projects} from '@Launch/types';
  import {useFormikContext} from 'formik';
  import useValues from '@Launch/hooks/useValues';
  import Line from '@Launch/components/common/Line';
  import {CustomButton} from 'components/Basic/CustomButton';
  import { PieChart } from '../PieChart';
  const PieChartModal = () => {
    const {data} = useAppSelector(selectModalType);
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {handleCloseModal} = useModal();
    const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  

useEffect(() => {
    console.log(values);
    
    
},[values])
    return (
      <Modal
        isOpen={data.modal === 'Launch_PieChartModal' ? true : false}
        isCentered
        onClose={() => {
          handleCloseModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="25px"
          pb="25px">
          <CloseButton closeFunc={handleCloseModal}></CloseButton>
          <ModalBody p={0}>
            <Box
              pb={'1.250em'}
              borderBottom={
                colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
              }>
              <Heading
                fontSize={'1.250em'}
                fontWeight={'bold'}
                fontFamily={theme.fonts.titil}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                textAlign={'center'}>
              Token Distribution
              </Heading>
            </Box>
  
            <Flex
              flexDir="column"
              alignItems="center"
              mt={'30px'}
            
              fontSize={13}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
              <Flex w={'100%'} flexDir={'column'} height={'340px'} alignItems={'center'}>
        <PieChart pieData={values} />
              </Flex>
            </Flex>
  
            <Box  mb={'25px'} px={'15px'}>
              <Line></Line>
            </Box>
  
            <Box as={Flex} flexDir="column" alignItems="center" pt={5}>
              <CustomButton
                text={'Close'}
                func={() => {
                  handleCloseModal();
                }}></CustomButton>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  
  export default PieChartModal;
  