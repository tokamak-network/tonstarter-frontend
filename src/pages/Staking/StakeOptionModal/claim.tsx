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
import React, {FC, useCallback, useState} from 'react';
import {claimReward} from '../staking.reducer';
import {useWeb3React} from '@web3-react/core';

type ClaimOptionModalProps = {
  isOpen: boolean;
  balance: string;
  stakeStartBlock: string | number;
  address: string;
  onClose: Function;
  onSubmit: Function;
};

export const ClaimOptionModal: FC<ClaimOptionModalProps> = ({
  isOpen,
  balance,
  stakeStartBlock,
  address,
  onClose,
  onSubmit,
}) => {
  const {account, library} = useWeb3React();
  const [value, setValue] = useState<number>(+balance);

  const handleChange = useCallback(e => setValue(e.target.value), []);
  const setMax = useCallback(_e => setValue(+balance), [balance]);

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
              Claim
            </Heading>
            <Text>You can claimxxx and earn xxx</Text>
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
                variant="outline"
                type={'button'}
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
              <Text>Claim Available</Text>
              <Text>{balance} TON</Text>
            </Box>
          </Stack>

          <Box py={4} as={Flex} justifyContent={'center'}>
            <Button
             onClick={() =>
              claimReward({
                userAddress: account,
                stakeContractAddress: address,
                stakeStartBlock: stakeStartBlock,
                library: library
              }) 
            }
              colorScheme={'blue'}>
              Claim
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
