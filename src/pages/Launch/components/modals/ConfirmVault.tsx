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
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '../common/Line';
import {LoadingComponent} from 'components/Loading';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import useVaultSelector from '@Launch/hooks/useVaultSelector';

const InfoList = (props: {title: string; content: string}) => {
  const {title, content} = props;
  const {colorMode} = useColorMode();
  return (
    <Box d="flex" h={'45px'} justifyContent={'space-between'} w={'100%'}>
      <Text
        fontSize={13}
        color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
        {title}
      </Text>
      <Text color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
        {content}
      </Text>
    </Box>
  );
};

const ConfirmTokenModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;
  const [deployStep, setDeployStep] = useState<
    'Ready' | 'Deploying' | 'Done' | 'Error'
  >('Ready');
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const {vaults} = values;
  const {vaultType, vaultName, func, infoList, close} = data.data;

  const {selectedVaultDetail} = useVaultSelector();

  console.log(deployStep);

  useEffect(() => {
    console.log(data.data.isSet);
    console.log(selectedVaultDetail?.isSet);
    if (
      data.data.isSet === true
        ? selectedVaultDetail?.isSet === true
        : selectedVaultDetail?.isDeployed === true
    ) {
      // setDeployStep('Done');
    }
    if (selectedVaultDetail?.isDeployedErr === true) {
      setDeployStep('Error');
    }
  }, [deployStep, values, selectedVaultDetail, data]);

  // if (!data?.data?.vaultName) {
  //   return null;
  // }

  function closeModal() {
    close();
    setDeployStep('Ready');
    handleCloseModal();
  }

  if (deployStep === 'Ready') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
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
                General | {vaultName}
              </Heading>
            </Box>

            <Flex
              flexDir="column"
              alignItems="center"
              mt={'30px'}
              px={'20px'}
              fontSize={15}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
              {infoList?.map((info: {title: string; content: string}) => {
                return (
                  <InfoList
                    title={info.title}
                    content={info.content}></InfoList>
                );
              })}
              <Flex
                mt={'35px'}
                flexDir={'column'}
                justifyContent="center"
                textAlign={'center'}>
                <Text
                  fontSize={13}
                  color={'#ff3b3b'}
                  fontWeight={600}
                  mb={'10px'}>
                  Warning
                </Text>
                <Text fontSize={12} color={'gray.225'}>
                  The team will create a TOS Reward Program (TOS) fund by buying
                  $100 worth of TOS tokens on a daily basis. The fund will be
                  used to reward to the contributors who have worked on the
                  following categories:
                </Text>
              </Flex>
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
        isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
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
          pt="20px"
          pb="25px">
          {/* <CloseButton closeFunc={() => closeModal()}></CloseButton> */}
          <ModalBody>
            <Flex
              py={'40px'}
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
                Waiting for completing to deploy your token
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (deployStep === 'Done') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
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
          <CloseButton closeFunc={closeModal}></CloseButton>
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
                Waiting for completing to deploy your token
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
      isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
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
        <CloseButton closeFunc={closeModal}></CloseButton>
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
              Your token has been failed to deploy :(
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

export default ConfirmTokenModal;
