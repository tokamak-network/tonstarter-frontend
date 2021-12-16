import {
  Box,
  useColorMode,
  useTheme,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import {getUserTonBalance} from 'client/getUserBalance';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailCounter} from './Detail_Counter';
import starterActions from '../../actions';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {useCallContract} from 'hooks/useCallContract';
import {convertNumber} from 'utils/number';
import store from 'store';
import {useBlockNumber} from 'hooks/useBlock';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {SaleInfo} from '@Starter/types';
import {useERC20} from '@Starter/hooks/useERC20';
import {ethers} from 'ethers';

type DepositContainerProp = {
  amountAvailable: string;
  inputTonBalance: string;
  saleContractAddress: string;
  wtonMode: boolean;
  btnDisabled: boolean;
};

const DepositContainer: React.FC<DepositContainerProp> = (prop) => {
  const {
    amountAvailable,
    inputTonBalance,
    saleContractAddress,
    wtonMode,
    btnDisabled,
  } = prop;

  const {account, library} = useActiveWeb3React();
  const {checkBalance} = useCheckBalance();
  const {
    tonBalance,
    wtonBalance,
    tonAllowance,
    wtonAllowance,
    originTonAllowance,
    originWtonAllowance,
    callTonDecreaseAllowance,
  } = useERC20(saleContractAddress);
  const dispatch = useDispatch();
  const {colorMode} = useColorMode();

  const [isTonApprove, setIsTonApprove] = useState<boolean>(false);
  const [isWTonApprove, setIsWTonApprove] = useState<boolean>(false);

  const [depositBtnDisabled, setDepositBtnDisabled] = useState<boolean>(true);

  useEffect(() => {
    setIsTonApprove(
      Number(originTonAllowance.replaceAll(',', '')) >= Number(inputTonBalance),
    );
    setIsWTonApprove(
      Number(originWtonAllowance.replaceAll(',', '')) >=
        Number(inputTonBalance),
    );
  }, [originTonAllowance, originWtonAllowance, inputTonBalance]);

  useEffect(() => {
    setDepositBtnDisabled(btnDisabled);
  }, [btnDisabled, amountAvailable]);

  let inputTonBalanceStr = inputTonBalance.replaceAll(' ', '');

  let inputBiggerThanZero = false;
  if (
    ethers.utils
      .parseUnits(inputTonBalanceStr, 18)
      .gt(ethers.BigNumber.from('0'))
  ) {
    inputBiggerThanZero = true;
  }

  if (wtonMode === false) {
    return (
      <Flex alignItems="center" justifyContent="space-between">
        {isTonApprove && inputBiggerThanZero ? (
          <CustomButton
            text={'Acquire'}
            isDisabled={depositBtnDisabled}
            func={() => {
              account &&
                checkBalance(
                  Number(inputTonBalance),
                  Number(tonBalance.replaceAll(',', '')),
                ) &&
                starterActions.participate({
                  account,
                  library,
                  address: saleContractAddress,
                  amount: inputTonBalance,
                });
            }}></CustomButton>
        ) : (
          <CustomButton
            text={'TON Approve'}
            isDisabled={
              depositBtnDisabled || !inputBiggerThanZero
              // || !amountAvailableFlag
            }
            style={{marginRight: '12px'}}
            func={() =>
              account &&
              dispatch(
                openModal({
                  type: 'Starter_Approve',
                  data: {
                    address: saleContractAddress,
                    amount: inputTonBalance,
                    tokenType: 'TON',
                  },
                }),
              )
            }></CustomButton>
        )}
        <Box
          d="flex"
          flexDir="column"
          justifyContent="center"
          ml={'15px'}
          fontSize={13}>
          <Text color={colorMode === 'light' ? 'gray.400' : 'gray.425'}>
            The Approved Amount
          </Text>
          <Text color={colorMode === 'light' ? 'gray.250' : 'white.200'}>
            {' '}
            {tonAllowance} TON{' '}
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {isWTonApprove && tonAllowance === '0.00' ? (
        <CustomButton
          text={'Acquire (WTON)'}
          isDisabled={depositBtnDisabled}
          style={{marginRight: '12px'}}
          func={() =>
            account &&
            checkBalance(
              Number(inputTonBalance),
              Number(wtonBalance.replaceAll(',', '')),
            ) &&
            starterActions.participate({
              account,
              library,
              address: saleContractAddress,
              amount: inputTonBalance,
            })
          }></CustomButton>
      ) : tonAllowance !== '0.00' ? (
        <CustomButton
          text={'Initialize TON Allowance'}
          isDisabled={depositBtnDisabled}
          style={{marginRight: '12px'}}
          func={() => callTonDecreaseAllowance()}></CustomButton>
      ) : (
        <CustomButton
          text={'WTON Approve'}
          isDisabled={depositBtnDisabled}
          func={() =>
            account &&
            dispatch(
              openModal({
                type: 'Starter_Approve',
                data: {
                  address: saleContractAddress,
                  amount: inputTonBalance,
                  tokenType: 'WTON',
                },
              }),
            )
          }></CustomButton>
      )}
      <Box
        d="flex"
        flexDir="column"
        justifyContent="center"
        ml={'15px'}
        fontSize={13}>
        <Text color={colorMode === 'light' ? 'gray.400' : 'gray.425'}>
          The Approved Amount
        </Text>
        <Text color={colorMode === 'light' ? 'gray.250' : 'white.200'}>
          {' '}
          {wtonAllowance} WTON{' '}
        </Text>
      </Box>
    </Flex>
  );
};

type OpenSaleDepositProps = {
  saleInfo: SaleInfo;
};

export const OpenSaleDeposit: React.FC<OpenSaleDepositProps> = (prop) => {
  const {saleInfo} = prop;
  const {
    tokenExRatio,
    saleContractAddress,
    tokenName,
    startAddWhiteTime,
    endExclusiveTime,
  } = saleInfo;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();
  const dispatch = useDispatch();

  // const {
  //   balance: {tonOrigin},
  // } = store.getState().user?.data;

  const [inputBalance, setInputBalance] = useState<string>('0');
  const [userTonBalance, setUserTonBalance] = useState<string>('-');
  const [totalAllocation, setTotalAllocation] = useState<string>('-');
  const [totalDeposit, setTotalDeposit] = useState<string>('-');
  const [yourDeposit, setYourDeposit] = useState<string>('-');
  const [userPayAmount, setYourPayAmount] = useState<string>('-');
  const [userSaleAmount, setUserSaleAmount] = useState<string>('-');
  const [userAllocate, setUserAllocate] = useState<string>('-');
  const [wtonMode, setWtonMode] = useState<boolean>(false);
  const [progress, setProgress] = useState('-');

  const {blockNumber} = useBlockNumber();
  const {tonBalance, wtonBalance} = useERC20(saleContractAddress);

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  const PUBLICSALE_CONTRACT = useCallContract(
    saleInfo.saleContractAddress,
    'PUBLIC_SALE',
  );

  useEffect(() => {
    async function callUserBalance() {
      const tonBalance = await getUserTonBalance({
        account,
        library,
        localeString: true,
      });
      return setUserTonBalance(tonBalance || '-');
    }
    if (account && library) {
      callUserBalance();
    }
  }, [account, library, blockNumber]);

  //call view funcions
  useEffect(() => {
    async function getData() {
      // const res = await Promise.all([

      // ])
      if (account && library && saleInfo && PUBLICSALE_CONTRACT) {
        const address = saleInfo.saleContractAddress;
        const res = await Promise.all([
          starterActions.getTotalExpectOpenSaleAmount({
            address,
            library,
          }),
          starterActions.getTotalDepositAmount({
            address,
            library,
          }),
          starterActions.getUserDeposit({
            account,
            library,
            address,
          }),
          PUBLICSALE_CONTRACT.usersEx(account),
          starterActions.getUserAllocate({
            account,
            library,
            address,
          }),
        ]);

        if (res) {
          //@ts-ignore
          setTotalAllocation(res[0]);
          //@ts-ignore
          setTotalDeposit(res[1]);
          //@ts-ignore
          setYourDeposit(res[2]);
          const saleAmount = res[3].saleAmount;
          const payAmount = res[3].payAmount;
          const userAllowcate = res[4];
          const convertedSaleAmount = convertNumber({
            amount: saleAmount.toString(),
            localeString: true,
          });
          const convertedPayAmount = convertNumber({
            amount: payAmount.toString(),
            localeString: true,
          });
          setYourPayAmount(convertedSaleAmount || '0.00');
          setUserSaleAmount(convertedPayAmount || '0.00');
          setUserAllocate(userAllowcate || '0.00');
        }
      }
    }
    if (account && library && saleInfo) {
      getData();
    }
  }, [account, library, saleInfo, PUBLICSALE_CONTRACT, blockNumber]);

  useEffect(() => {
    if (totalDeposit !== '-' && totalAllocation !== '-') {
      if (totalDeposit === '0.00') {
        setProgress('0');
      } else {
        const percent =
          String(
            (Number(totalDeposit.replaceAll(',', '')) /
              (Number(totalAllocation.replaceAll(',', '')) / tokenExRatio)) *
              100,
          ).split('.')[0] +
          '.' +
          String(
            (Number(totalDeposit.replaceAll(',', '')) /
              (Number(totalAllocation.replaceAll(',', '')) / tokenExRatio)) *
              100,
          )
            .split('.')[1]
            .slice(0, 1);
        setProgress(percent);
      }
    }
  }, [totalDeposit, totalAllocation, tokenExRatio]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box
        d="flex"
        textAlign="center"
        alignItems="center"
        justifyContent="space-between"
        mb={'20px'}>
        <Flex alignItems="center">
          <Text
            {...STATER_STYLE.mainText({colorMode, fontSize: 25})}
            mr={'20px'}>
            Public Round 2
          </Text>
          <DetailCounter
            numberFontSize={'18px'}
            stringFontSize={'14px'}
            date={saleInfo?.endDepositTime * 1000}></DetailCounter>
        </Flex>
        <Flex pr={2.5}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              WTON
            </FormLabel>
            <Switch
              onChange={() => {
                setWtonMode(!wtonMode);
              }}
              // defaultChecked={true}
              value={0}></Switch>
          </FormControl>
        </Flex>
      </Box>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'10px'}>
        Deposited Amount
      </Text>
      <Box d="flex" alignItems="center" mb={'20px'}>
        <Box mr={'10px'}>
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            color={
              Number(inputBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            value={inputBalance}
            setValue={setInputBalance}
            // maxBtn={true}
            maxValue={Number(userTonBalance.replaceAll(',', ''))}
            tokenName={wtonMode ? 'WTON' : 'TON'}></CustomInput>
        </Box>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 13})} mr={'3px'}>
          Your balance :{' '}
        </Text>
        <Text
          {...STATER_STYLE.mainText({colorMode, fontSize: 13})}
          color={'blue.100'}
          mr={'3px'}>
          {userTonBalance}
        </Text>
        <Text
          {...STATER_STYLE.mainText({colorMode, fontSize: 13})}
          color={'blue.100'}>
          TON
        </Text>
      </Box>
      <Box d="flex" flexDir="column">
        <Flex alignItems="center" pb={'5px'}>
          <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
            Details
          </Text>
          <Box
            d="flex"
            fontSize={'20px'}
            ml={'15px'}
            justifyContent="space-between">
            <Flex w={'286px'} mr={'25px'} fontSize={'16px'}>
              <Text color={'gray.400'}>(</Text>
              <Text color={'blue.100'} mr={'3px'} ml={'4px'}>
                Progress :{' '}
              </Text>
              <Text {...detailSubTextStyle} mr={'3px'}>
                {progress}
              </Text>
              <Text color={'gray.400'} mr={'3px'}>
                % )
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'286px'} mr={'25px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {convertTimeStamp(saleInfo?.startDepositTime, 'YYYY-MM-D')} ~{' '}
              {convertTimeStamp(saleInfo?.endDepositTime, 'MM-D')}
            </Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Total Allocation :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {totalAllocation}
            </Text>
            <Text>{saleInfo?.tokenName}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'286px'} mr={'25px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Total Deposited :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {totalDeposit}
            </Text>
            <Text>{'TON'}</Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Your Deposit :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {yourDeposit}
            </Text>
            <Text>{'TON'}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'286px'} mr={'25px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 1 :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {userPayAmount}
            </Text>
            <Text mr={'3px'}>{saleInfo?.tokenName}</Text>
            <Text color={'gray.400'} mr={'3px'}>
              ({userSaleAmount} TON)
            </Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Your Allocation :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {userAllocate}
            </Text>
            <Text>{saleInfo?.tokenName}</Text>
          </Flex>
        </Box>
      </Box>

      <Box mt={'27px'}>
        {/* {isApprove === true ? (
          <CustomButton
            text={'Deposit'}
            isDisabled={
              account === undefined ||
              library === undefined ||
              inputBalance === '0'
            }
            func={() =>
              account &&
              checkBalance(
                Number(inputBalance.replaceAll(',', '')),
                Number(userTonBalance.replaceAll(',', '')),
              ) &&
              starterActions.deposit({
                address: saleInfo.saleContractAddress,
                account,
                library,
                amount:
                  Number(inputBalance.replaceAll(',', '')) ===
                  Number(userTonBalance.replaceAll(',', ''))
                    ? store.getState().user?.data?.balance?.tonOrigin
                    : String(inputBalance),
              })
            }></CustomButton>
        ) : (
          <CustomButton
            text={'Approve'}
            func={() =>
              account &&
              dispatch(
                openModal({
                  type: 'Starter_Approve',
                  data: {
                    address: saleInfo.saleContractAddress,
                    amount: inputBalance,
                  },
                }),
              )
            }></CustomButton>
        )} */}
      </Box>
    </Flex>
  );
};
