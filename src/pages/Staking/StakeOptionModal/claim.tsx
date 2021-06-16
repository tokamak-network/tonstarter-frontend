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
  useTheme
} from '@chakra-ui/react';
import React, {FC, useCallback, useState} from 'react';
import {closeSale, claimReward} from '../staking.reducer';
import {useWeb3React} from '@web3-react/core';
import {useColorMode} from '@chakra-ui/react';

type ClaimOptionModalProps = {
  isOpen: boolean;
  balance: string;
  stakeStartBlock: string | number;
  address: string;
  vaultAddress: string;
  vaultClosed: boolean;
  onClose: Function;
  onSubmit: Function;
};

export const ClaimOptionModal: FC<ClaimOptionModalProps> = ({
  isOpen,
  balance,
  stakeStartBlock,
  address,
  vaultAddress,
  vaultClosed,
  onClose,
  onSubmit,
}) => {
  const {account, library} = useWeb3React();
  const [value, setValue] = useState<number>(+balance);

  const handleChange = useCallback(e => setValue(e.target.value), []);
  const setMax = useCallback(_e => setValue(+balance), [balance]);
  const {colorMode} = useColorMode();
  const theme = useTheme();
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
            <Text
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              width={'xs'}
              mr={6}
              onChange={handleChange}
              _focus={{
                borderWidth: 0,
              }}
            > {balance} TON
            </Text>
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
            {!vaultClosed? <Button mr={4} onClick={() => closeSale(
            {userAddress: account,
              vaultContractAddress: vaultAddress,
              stakeStartBlock: stakeStartBlock,
            library: library})}
              bg={theme.colors.yellow[200]}  color={'black'} >
              End sale
            </Button> : null}
          
            <Button
            disabled={!vaultClosed}
             onClick={() =>
              claimReward({
                userAddress: account,
                stakeContractAddress: address,
                stakeStartBlock: stakeStartBlock,
                library: library
              }) 
            }
            bg={theme.colors.yellow[200]}  color={'black'} >
              Claim
            </Button>

          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
