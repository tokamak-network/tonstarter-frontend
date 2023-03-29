import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Box,
    Heading,
    Text,
    Flex,
    Button,
    Image,
    useTheme,
    useColorMode,
  } from '@chakra-ui/react';
  import React, {useState} from 'react';
  import {useAppSelector} from 'hooks/useRedux';
  import {selectModalType} from 'store/modal.reducer';
  import {useModal} from 'hooks/useModal';
  import {CloseButton} from 'components/Modal';
  import Line from '@Launch/components/common/Line';
  import {CustomButton} from 'components/Basic/CustomButton';
  import {useRouteMatch} from 'react-router-dom';
  import gasIcon from 'assets/svgs/gas-graphic.svg';
  
  const EstimateGasModal = () => {
    const {data} = useAppSelector(selectModalType);
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {handleCloseModal} = useModal();
    const [isCheck, setIsCheck] = useState<boolean>(false);
  
    const match = useRouteMatch();
    const {url} = match;
  
    const closeModal = () => {
      setIsCheck(false);
      handleCloseModal();
    };
  
    return (
      <Modal
        isOpen={data.modal === 'Launch_EstimateGas' ? true : false}
        isCentered
        onClose={() => closeModal()}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          maxW="350px"
          h={'568px'}
          pt="25px"
          pb="25px">
          <CloseButton closeFunc={closeModal}></CloseButton>
        <ModalBody p={0}>
        <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'20px'}
              fontWeight={'bold'}
              fontFamily={'Titillium Web, sans-serif'}
              color={colorMode === 'light' ? '#3d495d' : 'white.100'}
              textAlign={'center'}>
              Gas Check
            </Heading>
          </Box>
          <Flex flexDir={'column'} w={'100%'} p={'25px'} textAlign={'center'}>
            <Text fontSize={13}>You need to have enough gas to <br/>
            complete all of the launch procedures.</Text>
          </Flex>
          <Flex flexDir={'column'} w={'100%'} py={'45px'} px={'120'} textAlign={'center'}>
            <Image src={gasIcon}/>
          </Flex>
        </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  
  export default EstimateGasModal;
  