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
  useTheme,
  useColorMode,
  Tooltip,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, openModal, selectModalType} from 'store/modal.reducer';
import {useState, useEffect, useMemo} from 'react';
import {fetchStakedBalancePayload} from '../utils/fetchStakedBalancePayload';
import {useUser} from 'hooks/useUser';
import {selectTransactionType} from 'store/refetch.reducer';
import {checkSaleClosed} from 'pages/Staking/utils';
import {BASE_PROVIDER} from 'constants/index';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';

export const ManageModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {btnStyle} = theme;
  const {colorMode} = useColorMode();

  const {account, library} = useUser();

  const memo_originalData = useMemo(() => {
    return data.data;
    /*eslint-disable*/
  }, [data]);

  const {contractAddress, vault, globalWithdrawalDelay, miningEndTime} =
    memo_originalData;

  //Buttons
  const [stakeL2Disabled, setStakeL2Disabled] = useState(true);
  const [unstakeL2Disable, setUnstakeL2Disable] = useState(true);
  const [withdrawDisable, setWithdrawDisable] = useState(true);
  const [swapDisabled, setSwapDisabled] = useState(true);

  //Balances
  const [availableBalance, setAvailableBalance] = useState('-');
  const [totalStaked, setTotalStaked] = useState('-');
  const [stakedL2, setStakdL2] = useState('-');
  const [pendingL2Balance, setPendingL2Balance] = useState('-');
  const [swapBalance, setSwapBalance] = useState('-');

  //conditions
  const [saleClosed, setSaleClosed] = useState(true);

  //Set

  //fetch status

  //constant

  useEffect(() => {
    async function getCurrentBlock() {
      const currentBlock = await BASE_PROVIDER.getBlockNumber();
      const res = miningEndTime - Number(globalWithdrawalDelay) <= currentBlock;
      return setStakeL2Disabled(res);
    }
    getCurrentBlock();
    /*eslint-disable*/
  }, [
    account,
    data,
    totalStaked,
    stakedL2,
    pendingL2Balance,
    transactionType,
    blockNumber,
  ]);

  useEffect(() => {
    async function getStakedBalance() {
      if (account && library && contractAddress) {
        const result = await fetchStakedBalancePayload(
          account,
          contractAddress,
          library,
        );
        const {
          totalStakedAmount,
          totalStakedAmountL2,
          totalPendingUnstakedAmountL2,
          stakeContractBalanceTon,
          swapBalance,
        } = result;
        if (
          totalStakedAmount &&
          totalStakedAmountL2 &&
          totalPendingUnstakedAmountL2 &&
          stakeContractBalanceTon &&
          swapBalance
        ) {
          setAvailableBalance(stakeContractBalanceTon);
          setTotalStaked(totalStakedAmount);
          setStakdL2(totalStakedAmountL2);
          setPendingL2Balance(totalPendingUnstakedAmountL2);
          setSwapBalance(swapBalance);
        }
      }
    }
    getStakedBalance();

    /*eslint-disable*/
  }, [account, data, transactionType, blockNumber]);

  const btnDisableUnstakeL2 = () => {
    return stakedL2 === '-' || Number(stakedL2) === 0
      ? setUnstakeL2Disable(true)
      : setUnstakeL2Disable(false);
  };

  const btnDisableWithdraw = () => {
    return pendingL2Balance === '-' || Number(pendingL2Balance) === 0
      ? setWithdrawDisable(true)
      : setWithdrawDisable(false);
  };

  const btnDisableSwap = () => {
    return Number(swapBalance) <= 0
      ? setSwapDisabled(true)
      : setSwapDisabled(false);
  };
  //Btn disable control
  useEffect(() => {
    async function checkSale() {
      const res = await checkSaleClosed(vault, library);
      setSaleClosed(res);
    }

    if (vault && library) {
      checkSale();
    }
    btnDisableSwap();
    btnDisableUnstakeL2();
    btnDisableWithdraw();
    /*eslint-disable*/
  }, [
    account,
    data,
    totalStaked,
    stakedL2,
    pendingL2Balance,
    swapBalance,
    transactionType,
    blockNumber,
  ]);

  const tooltipMsg = () => {
    return (
      <Flex flexDir="column" fontSize="12px" pt="6px" pl="5px" pr="5px">
        <Text textAlign="center" fontSize="12px">
          You can swap using seig TON.
        </Text>
        <Text textAlign="center">If you want to swap, you must unstake</Text>
        <Text textAlign="center">and withdraw seig TON first.</Text>
      </Flex>
    );
  };

  return (
    <Modal
      isOpen={data.modal === 'manage' ? true : false}
      isCentered
      onClose={() => dispatch(closeModal())}>
      <ModalOverlay />
      <ModalContent
        w={'21.875em'}
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        pt={'1.250em'}
        pb={'1.563em'}>
        <ModalBody p={0}>
          <Box
            textAlign="center"
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
              Manage
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'}>
              You can manage tokens
            </Text>
          </Box>

          <Stack
            as={Flex}
            pt={'1.875em'}
            pl={'1.875em'}
            pr={'1.875em'}
            justifyContent={'center'}
            alignItems={'center'}
            mb={'25px'}>
            <Box textAlign={'center'}>
              <Text fontSize={'0.813em'} color={'blue.300'} mb={'1.125em'}>
                Available balance
              </Text>
              <Text fontSize={'2em'}>
                {availableBalance} <span style={{fontSize: '13px'}}>TON</span>
              </Text>
            </Box>
            <Box
              display={'flex'}
              justifyContent="space-between"
              flexDir="column"
              w={'100%'}
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Total Staked
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {totalStaked} TON
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Staked in Layer 2
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {stakedL2} TON
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Pending UnStaked in Layer 2
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {pendingL2Balance} TON
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Flex>
                  <Text
                    color={'gray.400'}
                    fontSize="13px"
                    fontWeight={500}
                    mr="2px">
                    Available to swap
                  </Text>
                  <Tooltip
                    hasArrow
                    placement="top"
                    label={tooltipMsg()}
                    color={theme.colors.white[100]}
                    bg={theme.colors.gray[375]}
                    p={0}
                    w="227px"
                    h="70px"
                    borderRadius={3}
                    fontSize="12px">
                    <img src={tooltipIcon} />
                  </Tooltip>
                </Flex>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {swapBalance} TON
                </Text>
              </Flex>
            </Box>
          </Stack>

          <Grid
            templateColumns={'repeat(2, 1fr)'}
            pl="19px"
            pr="19px"
            gap={'12px'}>
            {/* <Button colorScheme="blue" onClick={() => toggleModal('stakeL2')}> */}
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'12px'}
              fontWeight={100}
              _hover={{backgroundColor: 'blue.100'}}
              {...(stakeL2Disabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={stakeL2Disabled}
              onClick={() =>
                dispatch(
                  openModal({
                    type: 'stakeL2',
                    data: {
                      account,
                      library,
                      balance: availableBalance,
                      contractAddress,
                    },
                  }),
                )
              }>
              Stake in Layer 2
            </Button>
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'12px'}
              fontWeight={100}
              _hover={{backgroundColor: 'blue.100'}}
              {...(unstakeL2Disable === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={unstakeL2Disable}
              onClick={() =>
                dispatch(
                  openModal({
                    type: 'unstakeL2',
                    data: {
                      contractAddress,
                      totalStakedAmountL2: stakedL2,
                    },
                  }),
                )
              }>
              Unstake from Layer 2
            </Button>
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'12px'}
              fontWeight={100}
              _hover={{backgroundColor: 'blue.100'}}
              {...(withdrawDisable === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={withdrawDisable}
              onClick={() =>
                dispatch(openModal({type: 'withdraw', data: data.data}))
              }>
              Withdraw
            </Button>
            <Button
              width="150px"
              bg={'blue.500'}
              color={'white.100'}
              fontSize={'12px'}
              fontWeight={100}
              _hover={{backgroundColor: 'blue.100'}}
              {...(swapDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={swapDisabled}
              onClick={() =>
                dispatch(openModal({type: 'swap', data: data.data}))
              }>
              Swap
            </Button>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
