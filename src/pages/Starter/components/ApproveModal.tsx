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
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CloseButton} from 'components/Modal';
import starterActions from '../actions';

export const ApproveModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;
  const {address, amount} = data.data;

  return (
    <Modal
      isOpen={data.modal === 'Starter_Approve' ? true : false}
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
            <Text textAlign="center">
              'Approve All' means to get an approval of the amount which is
              total supply of TON
            </Text>
          </Flex>

          <Box as={Flex} flexDir="column" alignItems="center" pt={5}>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              mb={3}
              _hover={{}}
              onClick={() => {
                account &&
                  starterActions.getAllowance({
                    account,
                    library,
                    address,
                    approveAll: true,
                  });
              }}>
              Approve All
            </Button>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              onClick={() => {
                account &&
                  starterActions.getAllowance({
                    account,
                    library,
                    address,
                    approveAll: false,
                    amount,
                  });
              }}>
              Approve ({amount} TON)
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};