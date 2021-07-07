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
} from '@chakra-ui/react';
import React, {useCallback, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {stakePaytoken} from '../staking.reducer';

export const StakeOptionModal = () => {
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const {account, library} = useWeb3React();

  let balance = data?.data?.user?.balance;
  const [value, setValue] = useState<string>('0');
  const theme = useTheme();

  const addComma = (inputVal: string) => {
    if (inputVal.length > 0 && value.substring(0, 1) === '0') {
      if (inputVal.split('.').length > 1) {
        return setValue(inputVal);
      }
      return setValue(value.substring(1, 2));
    }
    if (inputVal === '.') {
      setValue(inputVal);
    } else {
      setValue(
        inputVal
          .replace(/[^0-9a-zA-Z.]/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );
    }
  };

  const handleChange = (e: any) => addComma(e.target.value);
  const setMax = useCallback((_e) => setValue(balance), [balance]);

  const handleCloseModal = useCallback(
    () => dispatch(closeModal()),
    [dispatch],
  );

  return (
    <Modal
      isOpen={data.modal === 'stake' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        w="350px"
        pt="25px"
        pb="25px">
        <ModalBody p={0}>
          <Box t pb={'1.250em'} borderBottom="1px solid #f4f6f8">
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={'gray.250'}
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
              onChange={handleChange}
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
            borderBottom="1px solid #f4f6f8">
            <Box textAlign={'center'} pt="33px" pb="13px">
              <Text fontWeight={500} fontSize={'0.813em'} color={'gray.400'}>
                TON Balance
              </Text>
              <Text fontSize={'18px'} color="gray.250">
                {balance} TON
              </Text>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'} mt={'25px'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              onClick={() =>
                stakePaytoken({
                  userAddress: account,
                  amount: value.replaceAll(',', ''),
                  payToken: data.data.token,
                  saleStartTime: data.data.saleStartTime,
                  library: library,
                  stakeContractAddress: data.data.contractAddress,
                  miningStartTime: data.data.miningStartTime,
                  handleCloseModal: dispatch(closeModal()),
                })
              }>
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
