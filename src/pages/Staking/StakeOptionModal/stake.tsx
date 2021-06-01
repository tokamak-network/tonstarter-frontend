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
} from '@chakra-ui/react';
import {BigNumber} from 'ethers';
import React, {FC, useCallback, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import {stakeTon} from '../staking.reducer';
import {getSigner} from 'utils/contract';

type StakeOptionModalProps = {
  isOpen: boolean;
  balance: BigNumber;
  onClose: Function;
};

export const StakeOptionModal: FC<StakeOptionModalProps> = ({
  isOpen,
  onClose,
  balance,
}) => {
  const {account, library} = useWeb3React();

  const [value, setValue] = useState<number>(+balance);
  const handleChange = useCallback((e) => setValue(e.target.value), []);
  const setMax = useCallback((_e) => setValue(+balance), [balance]);

  return (
    <Modal isOpen={isOpen} isCentered onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box my={3} textAlign="center">
            <Heading
              fontWeight={'normal'}
              fontSize={'3xl'}
              textAlign={'center'}>
              Stake
            </Heading>
          </Box>

          <Stack
            as={Flex}
            py={10}
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
              width={'xs'}
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
            pb={5}
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box textAlign={'center'}>
              <Text>Available Balance</Text>
              <Text>{balance.toString()} TON</Text>
            </Box>
          </Stack>

          <Box py={4} as={Flex} justifyContent={'center'}>
            <Button
              disabled={balance.lte(0)}
              colorScheme={'blue'}
              onClick={() =>
                stakeTon({
                  userAddress: account,
                  tonAmount: '10000000000000000000',
                  library: library,
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
