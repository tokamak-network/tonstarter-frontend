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
  Grid,
} from '@chakra-ui/react';
import {closeSale} from '../staking.reducer';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {
  closeModal,
  ModalType,
  openModal,
  selectModalType,
} from 'store/modal.reducer';
import {useCallback} from 'react';

export const ManageModal = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();

  let balance = data?.data?.user?.balance;
  console.log(data?.data);

  return (
    <Modal
      isOpen={data.modal === 'manage' ? true : false}
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
              Manage
            </Heading>
            <Text>You can manage tokens</Text>
          </Box>

          <Stack
            p={5}
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box textAlign={'center'}>
              <Text>Available balance</Text>
              <Text>{balance} TON</Text>
            </Box>
            <Box textAlign={'center'}>
              <Text>Total: {data.data.totalStakedAmount} TON</Text>
              <Text>Staked in Layer 2: {data.data.stakeContractBalanceWton} TON</Text>
              <Text>Pending UnStaked in Layer 2: {data.data.totalPendingUnstakedAmount} TON</Text>
            </Box>
          </Stack>

          <Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
            {/* <Button colorScheme="blue" onClick={() => toggleModal('stakeL2')}> */}
            <Button colorScheme="blue" onClick={() => dispatch(openModal({type: 'stakeL2', data: data.data}))}>
              Stake in Layer2
            </Button>
            <Button colorScheme="blue" onClick={() => dispatch(openModal({type: 'unstakeL2', data: data.data}))}>
              Unstake from Layer2
            </Button>
            <Button colorScheme="blue" onClick={() => dispatch(openModal({type: 'withdraw', data: data.data}))}>
              Withdraw
            </Button>
            <Button colorScheme="blue" onClick={() => dispatch(openModal({type: 'swap', data: data.data}))}>
              Swap
            </Button>
            <Button
              colorScheme="blue"
              // disabled={!data.data.status}
              onClick={() =>
                closeSale({
                  userAddress: account,
                  vaultContractAddress: data.data.vault,
                  miningEndTime: data.data.miningEndTime,
                  library: library,
                  handleCloseModal: dispatch(closeModal()),
                })
              }>
              End Sale
            </Button>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
