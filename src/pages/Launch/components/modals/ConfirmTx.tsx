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
import {selectApp} from 'store/app/app.reducer';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';

const ConfirmTx = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;
  const {data: appConfig} = useAppSelector(selectApp);

  const [deployStep, setDeployStep] = useState<
    'Ready' | 'Deploying' | 'Done' | 'Error'
  >('Ready');
  const [poolCreated, setPoolCreated] = useState(false);
  const {
    data: {tempHash},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();

  const {func} = data.data;

  function closeModal() {
    try {
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
  if (deployStep === 'Ready') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
        isCentered
        onClose={() => {
          closeModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="20px"
          pb="25px">
          <CloseButton closeFunc={() => closeModal()}></CloseButton>
          <ModalBody p={0}>
            <Box
              pb={'1.250em'}
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }>
              <Heading
                fontSize={'1.250em'}
                fontWeight={'bold'}
                fontFamily={theme.fonts.titil}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                textAlign={'center'}>
                Confirm Your Transaction
              </Heading>
            </Box>

            <Flex
              flexDir="column"
              alignItems="center"
              mt={'30px'}
              px={'20px'}
              fontSize={15}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              >
                <Text fontSize={12} color={'gray.225'}>
                Confirm the Create Pool transaction
                </Text>
            
              </Flex>

            <Box w={'100%'} my={'25px'} px={'15px'}>
              <Line></Line>
            </Box>
            <Box as={Flex} flexDir="column" alignItems="center">
              <Button
                {...btnStyle.btnAble()}
                w={'150px'}
                fontSize="14px"
                _hover={{}}
                onClick={() => func() && setDeployStep('Deploying')}>
                Deploy
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  if (deployStep === 'Deploying') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
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
        isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
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

  return (
    <Modal
      isOpen={data.modal === 'Launch_ConfirmTx' ? true : false}
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

export default ConfirmTx;
