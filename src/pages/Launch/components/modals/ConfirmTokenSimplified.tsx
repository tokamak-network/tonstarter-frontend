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
    Link,
  } from '@chakra-ui/react';
  import React, {useEffect, useState} from 'react';
  import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
  import {selectModalType} from 'store/modal.reducer';
  import {useModal} from 'hooks/useModal';
  import {CloseButton} from 'components/Modal';
  import Line from '../common/Line';
  import {LoadingComponent} from 'components/Loading';
  import {useFormikContext} from 'formik';
  import {Projects} from '@Launch/types';
  import commafy from 'utils/commafy';
  import {selectApp} from 'store/app/app.reducer';
  import {selectLaunch, setTempHash} from '@Launch/launch.reducer';
  
  const ConfirmTokenSimplifiedModal = () => {
    const {data} = useAppSelector(selectModalType);
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {handleCloseModal} = useModal();
    const {btnStyle} = theme;
    const [deployStep, setDeployStep] = useState<
       'Deploying' | 'Done' | 'Error'
    >('Deploying');
    const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
    const {isTokenDeployed, isTokenDeployedErr, tokenType} = values;
    const {data: appConfig} = useAppSelector(selectApp);
    const {
      data: {tempHash},
    } = useAppSelector(selectLaunch);
    const dispatch = useAppDispatch();
  
    
    useEffect(() => {
        
      if (isTokenDeployed === true) {
        setDeployStep('Done');
      }
      if (isTokenDeployedErr === true) {
        setDeployStep('Error');
      }
    }, [deployStep, values, isTokenDeployed, isTokenDeployedErr]);
  
    if (!data?.data?.tokenInfo) {
      return <></>;
    }
  
    const {
      tokenInfo: {tokenName, totalSupply, tokenSymbol},
      func,
    } = data.data;
  
    function closeModal() {
      try {
        setFieldValue('isTokenDeployedErr', false);
        setDeployStep('Deploying');
        dispatch(
          setTempHash({
            data: undefined,
          }),
        );
        handleCloseModal();
      } catch (e) {
        console.log('--closeModal error--');
        console.log(e);
      }
    }
  
  
    if (deployStep === 'Deploying') {
      return (
        <Modal
          isOpen={data.modal === 'Launch_ConfirmTokenSimplified' ? true : false}
          isCentered
          closeOnOverlayClick={false}
          onClose={() => {
            closeModal();
          }}>
          <ModalOverlay />
          <ModalContent
            fontFamily={theme.fonts.roboto}
            bg={colorMode === 'light' ? 'white.100' : 'black.200'}
            w="350px"
            pt="20px">
            {/* <CloseButton closeFunc={() => closeModal()}></CloseButton> */}
            <ModalBody>
              <Flex
                pt={'40px'}
                pb={'17px'}
                flexDir={'column'}
                alignItems="center"
                justifyContent={'center'}
                textAlign={'center'}>
                <Box mb={'40px'}>
                  <LoadingComponent w={'80px'} h={'80px'}></LoadingComponent>
                </Box>
                <Text
                  w={'186px'}
                  fontSize={16}
                  color={'black.300'}
                  fontWeight={600}
                  textAlign={'center'}>
                  Waiting to complete deploying your token
                </Text>
  
                <Box w={'100%'} px={'15px'} mb={'25px'} mt={'40px'}>
                  <Line></Line>
                </Box>
                <Box as={Flex} flexDir="column" alignItems="center">
                  <Link
                    isExternal={true}
                    href={`${appConfig.explorerTxnLink}${tempHash}`}
                    color={'blue.100'}>
                    <Button
                      {...btnStyle.btnAble()}
                      w={'150px'}
                      fontSize="14px"
                      _hover={{}}
                      isDisabled={tempHash ? false : true}>
                      View on Etherscan
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      );
    }
  
    if (deployStep === 'Done') {
      return (
        <Modal
          isOpen={data.modal === 'Launch_ConfirmTokenSimplified' ? true : false}
          isCentered
          onClose={() => {
            handleCloseModal();
          }}>
          <ModalOverlay />
          <ModalContent
            fontFamily={theme.fonts.roboto}
            bg={colorMode === 'light' ? 'white.100' : 'black.200'}
            w="350px"
            pt="20px"
            pb="25px">
            <CloseButton closeFunc={handleCloseModal}></CloseButton>
            <ModalBody p={0}>
              <Flex
                pt={'56px'}
                flexDir={'column'}
                alignItems="center"
                justifyContent={'center'}>
                <Text
                  w={'186px'}
                  fontSize={16}
                  color={'black.300'}
                  fontWeight={600}
                  textAlign={'center'}>
                  Completed to deploy
                </Text>
                <Text
                  w={'186px'}
                  mb={'20px'}
                  fontSize={16}
                  color={'black.300'}
                  fontWeight={600}
                  textAlign={'center'}>
                  your token
                </Text>
                <Box w={'100%'} px={'15px'} mb={'25px'}>
                  <Line></Line>
                </Box>
                <Box as={Flex} flexDir="column" alignItems="center">
                  <Button
                    {...btnStyle.btnAble()}
                    w={'150px'}
                    fontSize="14px"
                    _hover={{}}
                    onClick={() => closeModal()}>
                    Confirm
                  </Button>
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      );
    }
  
    //deployStep === 'Error'
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmTokenSimplified' ? true : false}
        isCentered
        onClose={() => {
          handleCloseModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="20px"
          pb="25px">
          <CloseButton closeFunc={handleCloseModal}></CloseButton>
          <ModalBody p={0}>
            <Flex
              pt={'56px'}
              flexDir={'column'}
              alignItems="center"
              justifyContent={'center'}>
              <Text
                w={'186px'}
                mb={'55px'}
                fontSize={16}
                color={'black.300'}
                fontWeight={600}
                textAlign={'center'}>
                Your token failed to deploy :(
              </Text>
              <Box w={'100%'} px={'15px'} mb={'25px'}>
                <Line></Line>
              </Box>
              <Box as={Flex} flexDir="column" alignItems="center">
                <Button
                  {...btnStyle.btnAble()}
                  w={'150px'}
                  fontSize="14px"
                  _hover={{}}
                  bg={{}}
                  border={'1px solid #2a72e5'}
                  color={'blue.300'}
                  onClick={() => closeModal()}>
                  Go back to deploy
                </Button>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ConfirmTokenSimplifiedModal;
  