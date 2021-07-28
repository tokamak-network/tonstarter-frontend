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

  let balance = data?.data?.user?.balance;
  const {btnStyle} = theme;
  const {value, setValue, onChange} = useInput();
  // const {handleCloseModal, handleOpenConfirmModal} = useModal(setValue);
  const setMax = useCallback((_e) => setValue(balance), [setValue, balance]);
  const keys = [undefined, '', '0', '0.', '0.0', '0.00'];
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
              You can earn TON and POWER
            </Text>
          </Box>

          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Input
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              value={value}
              w="60%"
              mr={6}
              onKeyDown={onKeyDown}
              onChange={onChange}
              _focus={{
                borderWidth: 0,
              }}
            />
            <Box position={'absolute'} right={5}>
              <Button
                onClick={setMax}
                type={'button'}
                variant="outline"
                _focus={{
                  outline: 'none',
                }}>
                Max
              </Button>
            </Box>
          </Stack>

          <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Box textAlign={'center'} pt="33px" pb="13px">
              <Text fontWeight={500} fontSize={'0.813em'} color={'gray.400'}>
                TON Balance
              </Text>
              <Text
                fontSize={'18px'}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {balance} TON
              </Text>
            </Box>
          </Stack>

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
                  contractAddress: '',
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
