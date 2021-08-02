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
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useState, useEffect} from 'react';
import {fetchStakedBalancePayload} from '../utils/fetchStakedBalancePayload';
import {useUser} from 'hooks/useUser';
import {selectTransactionType} from 'store/refetch.reducer';
import {checkSaleClosed} from 'pages/Staking/utils';
import {BASE_PROVIDER} from 'constants/index';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';
import {fetchWithdrawPayload} from '../utils/fetchWithdrawPayload';
import {convertNumber} from 'utils/number';

const seigFontColors = {
  light: '#3d495d',
  dark: '#f3f4f1',
};

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

export const ManageModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const theme = useTheme();
  const {btnStyle} = theme;
  const {colorMode} = useColorMode();

  const {account, library} = useUser();
  const {handleOpenConfirmModal, handleCloseModal} = useModal();

  const {
    data: {contractAddress, vault, globalWithdrawalDelay, miningEndTime},
  } = data;

  //Buttons
  const [stakeL2Disabled, setStakeL2Disabled] = useState(true);
  const [unstakeL2Disable, setUnstakeL2Disable] = useState(true);
  const [withdrawDisable, setWithdrawDisable] = useState(true);
  const [swapDisabled, setSwapDisabled] = useState(true);

  //Balances
  const [availableBalance, setAvailableBalance] = useState('0');
  const [totalStaked, setTotalStaked] = useState('-');
  const [stakedL2, setStakdL2] = useState('-');
  const [pendingL2Balance, setPendingL2Balance] = useState('-');
  const [swapBalance, setSwapBalance] = useState('0');
  const [canWithdralAmount, setCanWithdralAmount] = useState(0);

  //original balances
  const [originalStakeBalance, setOriginalStakeBalance] = useState(0);
  const [originalSwapBalance, setOriginalSwapBalance] = useState(0);

  //conditions
  const [saleClosed, setSaleClosed] = useState(true);

  //Set

  //fetch status

  //constant

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
          originalBalance,
        } = result;
        const res_CanWithdralAmount = await fetchWithdrawPayload(
          library,
          account,
          contractAddress,
        );
        if (
          totalStakedAmount &&
          totalStakedAmountL2 &&
          totalPendingUnstakedAmountL2 &&
          stakeContractBalanceTon &&
          swapBalance &&
          res_CanWithdralAmount
        ) {
          setAvailableBalance(stakeContractBalanceTon);
          setTotalStaked(totalStakedAmount);
          setStakdL2(totalStakedAmountL2);
          setPendingL2Balance(totalPendingUnstakedAmountL2);
          setCanWithdralAmount(Number(res_CanWithdralAmount.toString()));

          //set original balances
          setOriginalStakeBalance(originalBalance.stakeContractBalanceTon);
          setOriginalSwapBalance(originalBalance.swapBalance);
          //calculate swap balance
          if (Number(swapBalance) <= 0) {
            return setSwapBalance('0');
          }
          if (Number(stakeContractBalanceTon) >= Number(swapBalance)) {
            return setSwapBalance(swapBalance);
          }
          if (Number(stakeContractBalanceTon) < Number(originalBalance)) {
            return setSwapBalance(stakeContractBalanceTon);
          }
        }
      }
    }
    if (transactionType === 'Staking' || transactionType === undefined) {
      getStakedBalance();
    }
    /*eslint-disable*/
  }, [data, transactionType, blockNumber]);

  //Btn disable control
  useEffect(() => {
    async function btnDisablestakeL2() {
      if (globalWithdrawalDelay && miningEndTime) {
        const currentBlock = await BASE_PROVIDER.getBlockNumber();
        const res =
          miningEndTime - Number(globalWithdrawalDelay) <= currentBlock;
        console.log(availableBalance);
        const checkBalance = Number(availableBalance) <= 0 ? true : false;
        return setStakeL2Disabled(res || checkBalance);
      }
    }

    const btnDisableUnstakeL2 = () => {
      return stakedL2 === '-' || stakedL2 === '0.00'
        ? setUnstakeL2Disable(true)
        : setUnstakeL2Disable(false);
    };

    const btnDisableWithdraw = () => {
      return canWithdralAmount <= 0
        ? setWithdrawDisable(true)
        : setWithdrawDisable(false);
    };

    const btnDisableSwap = () => {
      console.log(swapBalance);
      return Number(convertNumber({amount: swapBalance, round: false})) <= 0
        ? setSwapDisabled(true)
        : setSwapDisabled(false);
    };

    async function checkSale() {
      const res = await checkSaleClosed(vault, library);
      setSaleClosed(res);
    }

    if (
      data.modal === 'manage' ||
      transactionType === 'Staking' ||
      transactionType === undefined
    ) {
      if (vault && library) {
        checkSale();
      }

      setTimeout(() => {
        btnDisablestakeL2();
        btnDisableSwap();
        btnDisableUnstakeL2();
        btnDisableWithdraw();
      }, 1500);
    }

    /*eslint-disable*/
  }, [
    data,
    totalStaked,
    stakedL2,
    pendingL2Balance,
    swapBalance,
    transactionType,
    blockNumber,
  ]);

  const handleCloseManageModal = () => {
    setStakeL2Disabled(true);
    setUnstakeL2Disable(true);
    setWithdrawDisable(true);
    setSwapDisabled(true);
    setAvailableBalance('0');
    setTotalStaked('-');
    setStakdL2('-');
    setPendingL2Balance('-');
    setSwapBalance('0');
    setCanWithdralAmount(0);
    setOriginalStakeBalance(0);
    setOriginalSwapBalance(0);
    setSaleClosed(true);
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={data.modal === 'manage' ? true : false}
      isCentered
      onClose={handleCloseManageModal}>
      <ModalOverlay />
      <ModalContent
        w={'21.875em'}
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        pt={'1.250em'}
        pb={'1.563em'}>
        <CloseButton closeFunc={handleCloseManageModal}></CloseButton>
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
                  fontSize={'15px'}>
                  {totalStaked} TON
                </Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" h="55px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Staked in Layer 2 (Seig:{' '}
                  <strong style={{color: seigFontColors[colorMode]}}>
                    {swapBalance}
                  </strong>{' '}
                  <strong
                    style={{
                      color: seigFontColors[colorMode],
                      fontSize: '11px',
                    }}>
                    TON
                  </strong>
                  )
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'15px'}>
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
                  fontSize={'15px'}>
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
                  fontSize={'15px'}>
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
                handleOpenConfirmModal({
                  type: 'manage_stakeL2',
                  data: {
                    balance: availableBalance,
                    contractAddress,
                    originalStakeBalance,
                  },
                })
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
                handleOpenConfirmModal({
                  type: 'manage_unstakeL2',
                  data: {
                    totalStakedAmountL2: stakedL2,
                    contractAddress,
                  },
                })
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
                handleOpenConfirmModal({
                  type: 'manage_withdraw',
                  data: {
                    contractAddress,
                    pendingL2Balance: canWithdralAmount,
                  },
                })
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
                handleOpenConfirmModal({
                  type: 'manage_swap',
                  data: {
                    contractAddress,
                    swapBalance,
                    originalSwapBalance,
                  },
                })
              }>
              Swap
            </Button>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
