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
} from '@chakra-ui/react';
import React, {FC} from 'react';
import {BigNumber} from 'ethers';
import {withdraw} from '../staking.reducer';
import {useWeb3React} from '@web3-react/core';

type UnstakeOptionModalProps = {
  balance: string | BigNumber;
  stakeEndBlock: string | number;
  address: string;
  isOpen: boolean;
  onClose: Function;
  onSubmit: Function;
};

export const UnstakeOptionModal: FC<UnstakeOptionModalProps> = ({
  balance,
  stakeEndBlock,
  address,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {account, library} = useWeb3React();


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
              Unstake
            </Heading>
          </Box>

          <Stack
            as={Flex}
            py={10}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Text
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              width={'xs'}
              mr={6}
              _focus={{
                borderWidth: 0,
              }}
            >
             {balance} 
            </Text>
          </Stack>

          <Stack
            pb={5}
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box textAlign={'center'}>
              <Text>Available Balance</Text>
              <Text>{balance} TON</Text>
            </Box>
          </Stack>

          <Box py={4} as={Flex} justifyContent={'center'}>
            <Button
              type={'submit'}
              onClick={() => withdraw({
                userAddress: account,
                stakeEndBlock: stakeEndBlock,
                library: library,
                stakeContractAddress: address
              })}
              disabled={+balance <= 0}
              colorScheme={'blue'}>
              Unstake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
