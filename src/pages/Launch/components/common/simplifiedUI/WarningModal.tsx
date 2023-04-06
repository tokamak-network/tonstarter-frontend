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
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import ConfirmTermsModal from '@Launch/components/modals/ConfirmTerms';

const WarningModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [isCheck, setIsCheck] = useState<boolean>(false);

  const {openAnyModal} = useModal();

  const closeModal = () => {
    setIsCheck(false);
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={data.modal === 'Launch_Warning' ? true : false}
      isCentered
      onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        maxW="350px"
        pt="23px"
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
              Warning
            </Heading>
          </Box>
          <Flex flexDir={'column'} w={'100%'} p={'25px'} textAlign={'center'}>
            <Text fontSize={13}>
              When funding is complete, the funded tokens will be sent to the
              currently linked wallet address.
              <br />
              <br />
              Please check your wallet address and reconnect to your preferred
              wallet address if necessary.
            </Text>
          </Flex>
          <Flex alignSelf={'center'} w={'320px'}>
            <Line />
          </Flex>
          <Flex alignItems={'center'} w={'320px'} mx={'100px'} mt={'25px'}>
            <Button
              w={'150px'}
              h={'38px'}
              color={'#fff'}
              _hover={{}}
              border-radius={'4px'}
              _hover={{bg: 'blue.100'}}
              onClick={() => openAnyModal('Launch_ConfirmTerms', {
                from: 'simplified-launch',
              })}
              bg={'#257eee'}>
              Confirm
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
      <ConfirmTermsModal />
    </Modal>
  );
};

export default WarningModal;
