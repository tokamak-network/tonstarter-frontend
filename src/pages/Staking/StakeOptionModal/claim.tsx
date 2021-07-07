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
} from '@chakra-ui/react';
import {claimReward, closeSale} from '../staking.reducer';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';

export const ClaimOptionModal = () => {
  const {account, library} = useWeb3React();
  const theme = useTheme();

  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={data.modal === 'claim' ? true : false}
      isCentered
      onClose={() => dispatch(closeModal())}>
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
            <Text>
              You can claim {data.data.tokenSymbol} and earn{' '}
              {data.data.tokenSymbol}
            </Text>
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
              }}>
              {' '}
              {data.data.myclaimed} {data.data.tokenSymbol}
            </Text>
          </Stack>

          <Stack
            pb={5}
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box textAlign={'center'}>
              <Text>Claim Available</Text>
              <Text>
                {data.data.myclaimed} {data.data.tokenSymbol}
              </Text>
            </Box>
          </Stack>

          <Box py={4} as={Flex} justifyContent={'center'}>
            {!data.data.vaultClosed ? (
              <Button
                mr={4}
                onClick={() =>
                  closeSale({
                    userAddress: account,
                    vaultContractAddress: data.data.vault,
                    stakeStartBlock: data.data.stakeStartBlock,
                    library: library,
                  })
                }
                bg={theme.colors.yellow[200]}
                color={'black'}>
                End sale
              </Button>
            ) : null}

            <Button
              disabled={!data.data.vaultClosed}
              onClick={() =>
                claimReward({
                  userAddress: account,
                  stakeContractAddress: data.data.contractAddress,
                  stakeStartBlock: data.data.stakeStartBlock,
                  library: library,
                })
              }
              bg={theme.colors.yellow[200]}
              color={'black'}>
              Claim
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
