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
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {useERC20} from '@Starter/hooks/useERC20';

const ConfirmVaultModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;
  const {address, amount, tokenType} = data.data;
  const {callTonApprove, callWtonApprove} = useERC20(address);

  return (
    <Modal
      isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
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
              Starter
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              Approve
            </Text>
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={3}
            px={5}
            fontSize={15}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            {/* <Text textAlign="center">
              'Approve All' means to get an approval of the amount which is
              total supply of {tokenType}
            </Text> */}
            <Text textAlign="center">You will get allowance</Text>
            <Text textAlign="center">
              {/* {Number(STR_AMOUNT).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '} */}
              {amount}
              {tokenType}
            </Text>
          </Flex>

          <Box as={Flex} flexDir="column" alignItems="center" pt={5}>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              onClick={() => {
                tokenType === 'TON'
                  ? callTonApprove(amount)
                  : callWtonApprove(amount);
              }}>
              Approve
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmVaultModal;
