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
  Stack,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';

import React, {useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {withdraw} from '../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';

export const WithdrawalOptionModal = () => {
  const {sub} = useAppSelector(selectModalType);
  const {account, library} = useActiveWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {handleCloseConfirmModal} = useModal();

  const {
    data: {contractAddress, pendingL2Balance},
  } = sub;
  /*eslint-disable */
  const [value, setValue] = useState<number>(pendingL2Balance);

  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setValue(0);
  };

  return (
    <Modal
      isOpen={sub.type === 'manage_withdraw' ? true : false}
      isCentered
      onClose={handleCloseModal}>
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
            my={2}
            pb={'1.050em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Withdraw
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              Withdraw TON and they can be swapped to TOS. Swapped TOS can be
              claimed by stakers at the end of the mining date.
            </Text>
          </Box>
          <Stack
            as={Flex}
            pt={'1.875em'}
            pl={'1.875em'}
            pr={'1.875em'}
            justifyContent={'center'}
            alignItems={'center'}
            mb={'25px'}>
            <Box
              display={'flex'}
              justifyContent="center"
              flexDir="column"
              w={'100%'}>
              <Flex justifyContent="center" alignItems="center" h="15px">
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {pendingL2Balance} TON
                </Text>
              </Flex>
            </Box>
          </Stack>
          <Box
            py={4}
            as={Flex}
            justifyContent={'center'}
            borderTop={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              onClick={() => {
                withdraw({
                  userAddress: account,
                  contractAddress,
                  library: library,
                });
                handleCloseModal();
              }}>
              Withdraw
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
