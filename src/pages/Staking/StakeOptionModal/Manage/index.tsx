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
  Checkbox,
} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {fetchStakedBalancePayload} from '../utils/fetchStakedBalancePayload';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {selectTransactionType} from 'store/refetch.reducer';
import {checkSaleClosed} from 'pages/Staking/utils';
import {BASE_PROVIDER, DEPLOYED} from 'constants/index';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';
import {fetchWithdrawPayload} from '../utils/fetchWithdrawPayload';
import {convertNumber} from 'utils/number';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {fetchSwapPayload} from '../utils/fetchSwapPayload';
import {fetchSwappedTosBalance} from '../utils/fetchSwappedTosBalance';
import {getTokamakContract} from 'utils/contract';
import {SwapModal} from '../swap';

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

const TooltipPendingMsg = (
  currentBlock: number,
  withdrawableBlock: string,
  withdrawableAmount: string,
) => {
  return (
    <Flex flexDir="column" fontSize="12px" pt="6px" pl="5px" pr="5px">
      <Text textAlign="center">{withdrawableAmount} TON will be withdrawn</Text>
      <Text textAlign="center">
        at {withdrawableBlock} block (
        {Number(withdrawableBlock) - currentBlock <= 0
          ? 0
          : Number(withdrawableBlock) - currentBlock}{' '}
        left)
      </Text>
    </Flex>
  );
};

const Notice = ({
  totalStaked,
  mystaked,
  stakedRatio,
  setIsConfirmed,
  func,
}: {
  totalStaked: string;
  mystaked: string;
  stakedRatio: string;
  setIsConfirmed: Dispatch<SetStateAction<boolean>>;
  func: any;
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
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
          textAlign={'center'}
          mb={'8px'}>
          Notice
        </Heading>
      </Box>

      <Stack
        as={Flex}
        pt={'1.875em'}
        pl={'1.875em'}
        pr={'1.875em'}
        justifyContent={'center'}
        alignItems={'center'}>
        <Text fontSize={13} fontWeight={600} color={'#304156'} mb={'12px'}>
          Your staked on TOS Mining
        </Text>
        <Flex
          w={'302px'}
          h={'82px'}
          borderWidth={1}
          borderColor={'#d7d9df'}
          borderRadius={'10px'}
          flexDir={'column'}
          px={'20px'}
          py={'17px'}
          justifyContent={'space-between'}>
          <Box d={'flex'} justifyContent={'space-between'} w={'100%'}>
            <Text fontSize={13} color={'#808992'}>
              Total Staked
            </Text>
            <Text fontSize={15} fontWeight={600}>
              {totalStaked} <span style={{fontSize: 11}}>TON</span>
            </Text>
          </Box>
          <Box d={'flex'} justifyContent={'space-between'}>
            <Text fontSize={13} color={'#808992'}>
              {`My Staked (${stakedRatio}%)`}
            </Text>
            <Text fontSize={15} fontWeight={600}>
              {mystaked} <span style={{fontSize: 11}}>TON</span>
            </Text>
          </Box>
        </Flex>
        <Flex w={'300px'} textAlign={'center'} flexDir={'column'}>
          <Text
            fontSize={13}
            color={'#ff3b3b'}
            fontWeight={'bold'}
            mb={'10px'}
            mt={'30px'}>
            Warning
          </Text>
          <Text mb={'21px'} fontSize={12} color={'#3e495c'}>
            While TOS mining is not accepting new stakers, swapping related
            functions are open to anyone.
          </Text>
          <Flex justifyContent={'center'} gridColumnGap={'9px'}>
            <Checkbox
              w={'18px'}
              h={'18px'}
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}></Checkbox>
            <Text fontSize={12} color={'#3d495d'} fontWeight={600}>
              Agree
            </Text>
          </Flex>
          <Flex mt={'61px'} flexDir={'column'} mb={'56px'}>
            <Text fontSize={12} color={'#353c48'} mb={'15px'}>
              About TOS Mining
            </Text>
            <Text fontSize={12} color={'#808992'}>
              Users can stake TON to TOS mining and seigniorage earned from it
              can be swapped to TOS and claimable by stakers at the end of
              mining date.
            </Text>
          </Flex>
          <Button
            alignSelf={'center'}
            bg={isChecked ? '#257eee' : '#e9edf1'}
            fontSize={14}
            color={isChecked ? '#fff' : '#86929d'}
            fontWeight={600}
            w={'150px'}
            h={'38px'}
            onClick={() => {
              setIsConfirmed(true);
              func();
            }}
            _hover={{}}>
            Confirm
          </Button>
        </Flex>
      </Stack>
    </ModalBody>
  );
};

export const ManageModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {TokamakLayer2_ADDRESS} = DEPLOYED;

  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const theme = useTheme();
  const {btnStyle} = theme;
  const {colorMode} = useColorMode();

  const {account, library} = useActiveWeb3React();
  const {handleOpenConfirmModal, handleCloseModal} = useModal();

  const {
    data: {
      contractAddress,
      vault,
      globalWithdrawalDelay,
      miningEndTime,
      name,
      mystaked,
    },
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
  const [canUnstakedL2, setCanUntakdL2] = useState<string | undefined>('0');
  const [unstakeAll, setUnstakeAll] = useState<boolean>(false);
  const [pendingL2Balance, setPendingL2Balance] = useState('-');
  const [swapBalance, setSwapBalance] = useState('0');
  const [seigBalance, setSeigBalance] = useState<string | undefined>('0');
  const [canWithdralAmount, setCanWithdralAmount] = useState(0);
  const [swappedTosBalance, setSwappedTosBalance] = useState<string>('0');

  //original balances
  const [originalStakeBalance, setOriginalStakeBalance] = useState(0);
  const [originalSwapBalance, setOriginalSwapBalance] = useState('0');
  const [currentTosPrice, setCurrentTosPrice] = useState<string | undefined>(
    '0',
  );

  //conditions
  const [saleClosed, setSaleClosed] = useState(true);
  const [currentBlock, setCurrentBlock] = useState<number>(99999999999999);

  //for tooltip
  const [withdrawableBlock, setWithdrawableBlock] = useState('0');
  const [withdrawableAmount, setWithdrawableAmount] = useState('0');

  //Set

  //fetch status

  //constant

  //getCurrentBlock
  useEffect(() => {
    async function getCurrentBlock() {
      const currentBlock = await BASE_PROVIDER.getBlockNumber();
      setCurrentBlock(currentBlock);
    }
    getCurrentBlock();
  }, [data, transactionType, blockNumber]);

  //pending tooltip
  useEffect(() => {
    async function getWithdrawableBlock() {
      const depositManager = getTokamakContract('DepositManager', library);
      const requestedIndex = await depositManager.withdrawalRequestIndex(
        DEPLOYED.TokamakLayer2_ADDRESS,
        contractAddress,
      );
      const res = await depositManager.withdrawalRequest(
        DEPLOYED.TokamakLayer2_ADDRESS,
        contractAddress,
        requestedIndex,
      );
      const convertedNum = convertNumber({amount: res.amount, type: 'ray'});
      if (convertedNum) {
        setWithdrawableBlock(res.withdrawableBlockNumber.toString());
        setWithdrawableAmount(convertedNum);
      }
    }
    if (pendingL2Balance !== '-' && pendingL2Balance !== '0.00')
      getWithdrawableBlock();
  }, [
    contractAddress,
    account,
    blockNumber,
    currentBlock,
    library,
    pendingL2Balance,
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
          stakeContractBalanceWton,
          originalBalance,
        } = result;
        //@ts-ignore
        const res_CanWithdralAmount = await fetchWithdrawPayload(
          library,
          contractAddress,
        );
        const tosPrice = await fetchSwapPayload(library);
        const fetchedSwappedTosBalance = await fetchSwappedTosBalance(
          contractAddress,
          library,
        );
        if (
          totalStakedAmount &&
          totalStakedAmountL2 &&
          totalPendingUnstakedAmountL2 &&
          stakeContractBalanceTon &&
          stakeContractBalanceWton &&
          res_CanWithdralAmount &&
          fetchedSwappedTosBalance
        ) {
          const totalStakedBalance =
            Number(stakeContractBalanceTon.replaceAll(',', '')) +
            Number(stakeContractBalanceWton.replaceAll(',', ''));

          setAvailableBalance(totalStakedBalance.toString() || '-');
          setTotalStaked(totalStakedAmount);
          setStakdL2(totalStakedAmountL2);
          setPendingL2Balance(totalPendingUnstakedAmountL2);
          setCanWithdralAmount(Number(res_CanWithdralAmount.toString()));
          setSwappedTosBalance(fetchedSwappedTosBalance);
          //set original balances
          setOriginalStakeBalance(originalBalance.stakeContractBalanceTon);
          setOriginalSwapBalance(originalBalance.stakeContractBalanceTonRay);
          setCurrentTosPrice(tosPrice);

          if (miningEndTime <= currentBlock) {
            return setSwapBalance('0.00');
          }

          if (
            Number(stakeContractBalanceTon.replaceAll(',', '')) >=
            Number(totalStakedAmount.replaceAll(',', ''))
          ) {
            return setSwapBalance('0.00');
          }

          setSwapBalance(totalStakedBalance.toString() || '-');
          //calculate swap balance
          // if (Number(convertedUnstakeNum) <= 0) {
          //   return setSwapBalance('0.00');
          // }
          // if (Number(stakeContractBalanceTon) >= Number(convertedUnstakeNum)) {
          //   //@ts-ignore
          //   return setSwapBalance(stakeContractBalanceTon);
          // }
          // if (Number(stakeContractBalanceTon) < Number(swapBalance)) {
          //   return setSwapBalance(stakeContractBalanceTon);
          // }
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
        const res =
          miningEndTime - Number(globalWithdrawalDelay) <= currentBlock;
        const checkBalance = Number(availableBalance) <= 0 ? true : false;
        return setStakeL2Disabled(res || checkBalance);
      }
    }

    const btnDisableUnstakeL2 = async () => {
      if (contractAddress === undefined) {
        return;
      }
      const StakeTONContract = new Contract(
        contractAddress,
        StakeTON.abi,
        library,
      );

      const isUnstakeL2All =
        await StakeTONContract.canTokamakRequestUnStakingAll(
          TokamakLayer2_ADDRESS,
        );

      const canReqeustUnstaking =
        await StakeTONContract.canTokamakRequestUnStaking(
          TokamakLayer2_ADDRESS,
        );

      const convertedUnstakeNum = convertNumber({
        amount: canReqeustUnstaking,
        type: 'ray',
      });

      setUnstakeAll(isUnstakeL2All);
      setCanUntakdL2(convertedUnstakeNum);
      setSeigBalance(convertedUnstakeNum);

      if (isUnstakeL2All) {
        setCanUntakdL2(stakedL2);
        return setUnstakeL2Disable(false);
      }
      return Number(convertedUnstakeNum) <= 0
        ? setUnstakeL2Disable(true)
        : setUnstakeL2Disable(false);
    };

    const btnDisableWithdraw = () => {
      return canWithdralAmount <= 0
        ? setWithdrawDisable(true)
        : setWithdrawDisable(false);
    };

    const btnDisableSwap = () => {
      return Number(swapBalance.replaceAll(',', '')) <= 0 ||
        miningEndTime <= currentBlock
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

      btnDisablestakeL2();
      btnDisableSwap();
      btnDisableUnstakeL2();
      btnDisableWithdraw();
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
    canWithdralAmount,
    saleClosed,
    currentBlock,
  ]);

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

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
    setOriginalSwapBalance('0');
    setSaleClosed(true);
    setIsConfirmed(false);

    handleCloseModal();
  };

  const stakedRatio = (Number(mystaked) / Number(totalStaked)).toFixed(2);

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
        {isConfirmed === false ? (
          <Notice
            totalStaked={totalStaked}
            mystaked={mystaked}
            stakedRatio={stakedRatio}
            setIsConfirmed={setIsConfirmed}
            func={() => {
              handleCloseManageModal();
              handleOpenConfirmModal({
                type: 'manage_swap',
                data: {
                  contractAddress,
                  swapBalance,
                  originalSwapBalance,
                  currentTosPrice,
                  unstakeL2Disable,
                  withdrawDisable,
                  swapDisabled,
                  stakedL2,
                  stakedRatio,
                  canWithdralAmount,
                  unstakeAll,
                  canUnstakedL2,
                  ...data.data,
                },
              });
            }}
          />
        ) : (
          <ModalBody p={0}>
            <Box
              textAlign="center"
              pb={'1.250em'}
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }>
              <Heading
                fontSize={'1.250em'}
                fontWeight={'bold'}
                fontFamily={theme.fonts.titil}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                textAlign={'center'}
                mb={'8px'}>
                Manage
              </Heading>
              <Text color="gray.175" fontSize={'0.750em'}>
                You can manage {name} Product
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
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="55px">
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
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="55px">
                  <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                    Staked in Layer 2
                  </Text>
                  <Text
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                    fontWeight={500}
                    fontSize={'15px'}>
                    {stakedL2} TON
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="55px">
                  <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                    Seigniorage
                  </Text>
                  <Text
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                    fontWeight={500}
                    fontSize={'15px'}>
                    {seigBalance} TON
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="55px">
                  <Flex>
                    <Text
                      color={'gray.400'}
                      fontSize="13px"
                      fontWeight={500}
                      mr={1}>
                      Pending UnStaked in Layer 2
                    </Text>
                    {pendingL2Balance === '-' ||
                    Number(pendingL2Balance) <= 0 ? null : (
                      <Tooltip
                        hasArrow
                        placement="top"
                        label={TooltipPendingMsg(
                          currentBlock,
                          withdrawableBlock,
                          withdrawableAmount,
                        )}
                        color={theme.colors.white[100]}
                        bg={theme.colors.gray[375]}
                        p={0}
                        w="220px"
                        h="50px"
                        borderRadius={3}
                        fontSize="12px">
                        <img src={tooltipIcon} />
                      </Tooltip>
                    )}
                  </Flex>
                  <Text
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                    fontWeight={500}
                    fontSize={'15px'}>
                    {pendingL2Balance} TON
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="55px">
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
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="55px">
                  <Flex>
                    <Text
                      color={'gray.400'}
                      fontSize="13px"
                      fontWeight={500}
                      mr="2px">
                      Swapped TOS
                    </Text>
                  </Flex>
                  <Text
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                    fontWeight={500}
                    fontSize={'15px'}>
                    {swappedTosBalance} TOS
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
                // {...(stakeL2Disabled === true
                //   ? {...btnStyle.btnDisable({colorMode})}
                //   : {...btnStyle.btnAble()})}
                // isDisabled={stakeL2Disabled}
                {...btnStyle.btnDisable({colorMode})}
                isDisabled={true}
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
                      canUnstakedL2,
                      contractAddress,
                      unstakeAll,
                      name,
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
                      currentTosPrice,
                    },
                  })
                }>
                Swap
              </Button>
            </Grid>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
