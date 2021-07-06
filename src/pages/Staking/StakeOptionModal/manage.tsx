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
  useTheme
} from '@chakra-ui/react';
import {closeSale} from '../staking.reducer';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {
  closeModal,
  openModal,
  selectModalType,
} from 'store/modal.reducer';

export const ManageModal = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  let balance = data?.data?.user?.balance;
  console.log(data?.data);

  return (
    <Modal
      isOpen={data.modal === 'manage' ? true : false}
      isCentered
      onClose={() => dispatch(closeModal())}
      
    >
      <ModalOverlay />
      <ModalContent 
        w={'21.875em'}
        fontFamily={theme.fonts.roboto}
        pt={'1.250em'} 
        pb={'1.563em'}
    >
        <ModalBody p={0}>
          <Box textAlign="center" pb={'1.250em'} borderBottom="1px solid #f4f6f8">
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={'gray.250'}
              textAlign={'center'}
              >
              Manage
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'}>You can manage tokens</Text>
          </Box>

          <Stack
            as={Flex}
            pt={'1.875em'}
            pl={'1.875em'}
            pr={'1.875em'}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box textAlign={'center'}>
              <Text fontSize={'0.813em'} color={'blue.300'} mb={'1.125em'}>Available balance</Text>
              <Text fontSize={'2em'}>{balance} <span style={{fontSize: '13px'}}>TON</span></Text>
            </Box>
            <Box display={'flex'} justifyContent="space-between"
            flexDir="column"
            w={'100%'}
            >
              <Flex justifyContent="space-between"
              alignItems="center"
              h="55px"
              >
                <Text color={'gray.400'} fontSize="13px"
                fontWeight={500}>Total</Text>
              <Text color="gray.250"
              fontWeight={500}
              fontSize={'18px'}
              >{data.data.totalStakedAmount} TON</Text>
              </Flex>
              <Flex justifyContent="space-between"
              alignItems="center"
              h="55px"
              >
                <Text color={'gray.400'} fontSize="13px"
                fontWeight={500}>Staked in Layer 2</Text>
              <Text color="gray.250"
              fontWeight={500}
              fontSize={'18px'}
              >{data.data.stakeContractBalanceWton} TON</Text>
              </Flex>
              <Flex justifyContent="space-between"
              alignItems="center"
              h="55px"
              >
                <Text color={'gray.400'} fontSize="13px"
                fontWeight={500}>Pending UnStaked in Layer 2</Text>
                 <Text color="gray.250"
              fontWeight={500}
              fontSize={'18px'}
              >{data.data.totalPendingUnstakedAmount} TON</Text>
              </Flex>
              </Box>
          </Stack>

          <Grid templateColumns={'repeat(2, 1fr)'} pl="19px" pr="19px" gap={'12px'}>
            {/* <Button colorScheme="blue" onClick={() => toggleModal('stakeL2')}> */}
            <Button 
            width='150px'
            bg={'blue.400'}
            color={'white.100'}
            fontSize={'12px'}
            onClick={() => dispatch(openModal({type: 'stakeL2', data: data.data}))}>
              Stake in Layer2
            </Button>
            <Button width='150px'
            bg={'blue.400'}
            color={'white.100'}
            fontSize={'12px'} onClick={() => dispatch(openModal({type: 'unstakeL2', data: data.data}))}>
              Unstake from Layer2
            </Button>
            <Button width='150px'
            bg={'blue.400'}
            color={'white.100'}
            fontSize={'12px'} onClick={() => dispatch(openModal({type: 'withdraw', data: data.data}))}>
              Withdraw
            </Button>
            <Button width='150px'
            bg={'blue.400'}
            color={'white.100'}
            fontSize={'12px'}onClick={() => dispatch(openModal({type: 'swap', data: data.data}))}>
              Swap
            </Button>
            <Button
            width='150px'
            bg={'blue.400'}
            color={'white.100'}
            fontSize={'12px'}
              // disabled={!data.data.vaultClosed}
              onClick={() =>
                closeSale({
                  userAddress: account,
                  vaultContractAddress: data.data.vault,
                  stakeStartBlock: data.data.stakeStartBlock,
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
