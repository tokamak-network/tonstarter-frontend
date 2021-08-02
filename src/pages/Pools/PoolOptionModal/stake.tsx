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
  Input,
  Stack,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import React, {useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppSelector, useAppDispatch} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {stake} from '../actions';
import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';

export const StakeOptionModal = () => {
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const {account, library} = useWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {btnStyle} = theme;
  // const {handleCloseModal, handleOpenConfirmModal} = useModal(setValue);
  // const btnDisabled = keys.indexOf(value) !== -1 ? true : false;
  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <Modal
      isOpen={data.modal === 'stakePool' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
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
              Stake
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn TOS
            </Text>
          </Box>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              // {...(btnDisabled === true
              //   ? {...btnStyle.btnDisable({colorMode})}
              //   : {...btnStyle.btnAble()})}
              w={'150px'}
              fontSize="14px"
              _hover={{...theme.btnHover}}
              // disabled={btnDisabled}
              onClick={() =>
                stake({
                  userAddress: account,
                  tokenId: data.data,
                  library: library,
                  handleCloseModal: handleCloseModal(),
                })
              }
            >
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

