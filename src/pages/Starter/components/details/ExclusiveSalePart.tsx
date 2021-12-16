import {
  Box,
  useColorMode,
  useTheme,
  Flex,
  Text,
  Switch,
} from '@chakra-ui/react';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useEffect, useState} from 'react';
import {DetailCounter} from './Detail_Counter';
import ArrowIcon from 'assets/svgs/arrow_icon.svg';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailInfo, SaleInfo} from '@Starter/types';
import {useCallContract} from 'hooks/useCallContract';
import {convertNumber} from 'utils/number';
import starterActions from '../../actions';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {BigNumber, ethers} from 'ethers';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {useERC20} from '@Starter/hooks/useERC20';
import useMaxValue from '@Starter/hooks/useMaxValue';

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
    // zena
    // const isBtnAble =
    //   btnDisabled || Number(amountAvailable.replaceAll(',', '')) <= 0;
     const isBtnAble = !btnDisabled ;

      console.log('isBtnAble',isBtnAble);
      console.log('btnDisabled',btnDisabled);
    //zena
     setDepositBtnDisabled(btnDisabled);
     // setDepositBtnDisabled(isBtnAble);
  }, [btnDisabled, amountAvailable]);

  console.log('isTonApprove: ',isTonApprove, "isWTonApprove",isWTonApprove );
  console.log('originTonAllowance: ',originTonAllowance, "originWtonAllowance",originWtonAllowance );
  console.log( "tonAllowance",tonAllowance, "wtonAllowance",wtonAllowance);
  console.log('wtonBalance: ',wtonBalance, "tonBalance",tonBalance);
  console.log('amountAvailable: ',amountAvailable );

  console.log('depositBtnDisabled: ',depositBtnDisabled, "inputTonBalance:",inputTonBalance.trim(),",");
  console.log('btnDisabled: ',btnDisabled, "amountAvailable",amountAvailable);
  console.log('!(depositBtnDisabled || tonBalance !== 0.00:) ', !(depositBtnDisabled || tonBalance !== '0.00'));
  console.log('inputTonBalance !==0 ', inputTonBalance.trim() !== '0', !(depositBtnDisabled || tonBalance !== '0.00') && inputTonBalance.trim() === '0');

  let inputTonBalanceStr = inputTonBalance.replaceAll(' ','') ;
  let inputTonBalanceWei = ethers.utils.parseUnits(inputTonBalanceStr, 18).toString();
  console.log('inputTonBalanceWei',inputTonBalanceWei, inputTonBalanceWei === inputTonBalance);

  let inputBiggerThanZero = false;
  if(ethers.utils.parseUnits(inputTonBalanceStr, 18).gt(ethers.BigNumber.from('0') ) ) inputBiggerThanZero=true;
  console.log('inputBiggerThanZero',inputBiggerThanZero);

  let tonApproveSameInput = false;
  if(originTonAllowance === inputTonBalanceWei) tonApproveSameInput = true;
  console.log('tonApproveSameInput',tonApproveSameInput);

  let amountAvailableFlag = false;
  if(amountAvailable.trim() !== '-') amountAvailableFlag =true;

  if (wtonMode === false) {
    return (
      <Flex alignItems="center" justifyContent="space-between">
        {isTonApprove && tonApproveSameInput && inputBiggerThanZero? (
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
            isDisabled={depositBtnDisabled || !inputBiggerThanZero || !amountAvailableFlag}
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
          isDisabled={inputTonBalance.trim() === '0' || !(depositBtnDisabled || tonBalance !== '0.00')}
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
          text={'TON Decrease Allowance'}
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

type ExclusiveSalePartProps = {
  saleInfo: SaleInfo;
  detailInfo: DetailInfo | undefined;
};

export const ExclusiveSalePart: React.FC<ExclusiveSalePartProps> = (prop) => {
  const {saleInfo, detailInfo} = prop;
  const {
    tokenExRatio,
    saleContractAddress,
    fundingTokenType,
    tokenName,
    startAddWhiteTime,
    endExclusiveTime,
  } = saleInfo;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();

  const [inputTonBalance, setInputTonBalance] = useState<string>('0');
  const [convertedTokenBalance, setConvertedTokenBalance] =
    useState<string>('0');

  const [amountAvailable, setAmountAvailable] = useState<string>('-');
  const [userAllocation] = useState<string>(
    detailInfo
      ? detailInfo.tierAllocation[
          detailInfo.userTier !== 0 ? detailInfo.userTier : 1
        ]
      : '0',
  );
  const [userTierAllocation, setUserTierAllocation] = useState<string>('-');
  const [payAmount, setPayAmount] = useState<string>('-');
  const [saleAmount, setSaleAmount] = useState<string>('-');
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);

  const [wtonMode, setWtonMode] = useState<boolean>(false);

  const PUBLICSALE_CONTRACT = useCallContract(
    saleContractAddress,
    'PUBLIC_SALE',
  );

  const {
    tonBalance,
    wtonBalance,
    callTonDecreaseAllowance,
    callWtonDecreaseAllowance,
  } = useERC20(saleContractAddress);

  const {maxValue} = useMaxValue({
    tonBalance,
    wtonBalance,
    amountAvailable,
    tokenExRatio,
  });

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  useEffect(() => {
    async function getTierAllowcation() {
      if (PUBLICSALE_CONTRACT && detailInfo) {
        const payAmount = await PUBLICSALE_CONTRACT.usersEx(account);
        const availableAmounT = await PUBLICSALE_CONTRACT.calculTierAmount(
          account,
        );

        const pay = convertNumber({
          amount: payAmount.saleAmount,
          localeString: true,
        });
        const sale = convertNumber({
          amount: payAmount.payAmount,
          localeString: true,
        });
        const res =
          detailInfo.totalExpectSaleAmount[
            detailInfo.userTier !== 0 ? detailInfo.userTier : 1
          ];
        const availalbleSubPay = BigNumber.from(availableAmounT).sub(
          payAmount.saleAmount,
        );
        const convertedAvailableAmount = convertNumber({
          amount: availalbleSubPay.toString(),
          localeString: true,
        });
        setUserTierAllocation(detailInfo.userTier === 0 ? '-' : res);

        //temp
        setAmountAvailable(
          convertedAvailableAmount &&
            Number(convertedAvailableAmount.replaceAll(',', '')) > tokenExRatio
            ? convertedAvailableAmount
            : '0.00',
        );
        setSaleAmount(sale || '0.00');
        setPayAmount(pay || '0.00');
      }
    }
    if (account && library && PUBLICSALE_CONTRACT && saleInfo) {
      getTierAllowcation();
    }
  }, [
    account,
    library,
    PUBLICSALE_CONTRACT,
    detailInfo,
    saleInfo,
    tokenExRatio,
  ]);

  useEffect(() => {
    if (saleInfo) {
      const result = Number(inputTonBalance) * tokenExRatio;
      if (String(result).split('.')[1]?.length > 2) {
        return setConvertedTokenBalance(
          `${String(result).split('.')[0]}.${String(result)
            .split('.')[1]
            .slice(0, 2)}`,
        );
      }
      setConvertedTokenBalance(String(result));
    }
  }, [inputTonBalance, saleInfo, convertedTokenBalance, tokenExRatio]);

  useEffect(() => {
    async function getInfo() {
      if (account && library && saleContractAddress) {
        const whiteListInfo = await starterActions.isWhiteList({
          account,
          library,
          address: saleContractAddress,
        });
        // const amount = await starterActions.isWhiteList({
        //   account,
        //   library,
        //   address: saleContractAddress,
        // });

        //zena
        // setBtnDisabled(
        //   !whiteListInfo[0] ||
        //     Number(amountAvailable.replaceAll(',', '')) < tokenExRatio,
        // );
        setBtnDisabled(false);
        // setAmountAvailable();
      }
    }
    if (account && library && saleContractAddress) {
      getInfo();
    }
  }, [account, library, saleContractAddress, amountAvailable, tokenExRatio]);

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
            Public Round 1
          </Text>
          <DetailCounter
            numberFontSize={'18px'}
            stringFontSize={'14px'}
            date={endExclusiveTime * 1000}></DetailCounter>
        </Flex>
        <Flex pr={2.5}>
          <Switch
            onChange={() => {
              setWtonMode(!wtonMode);
            }}
            // defaultChecked={true}
            value={0}></Switch>
        </Flex>
      </Box>
      <Box d="flex">
        <Text
          color={colorMode === 'light' ? 'gray.375' : 'white.100'}
          fontSize={14}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          Acquire Amount
        </Text>
        <Text
          {...STATER_STYLE.subText({colorMode: 'light'})}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          (Your balance :{' '}
          {wtonMode === false ? `${tonBalance} TON` : `${wtonBalance} WTON`})
        </Text>
      </Box>
      <Box d="flex" alignItems="center" mb={'30px'}>
        <Box d="flex" mr={'10px'} alignItems="center" pos="relative">
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={inputTonBalance}
            setValue={setInputTonBalance}
            color={
              Number(inputTonBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            tokenName={wtonMode ? 'WTON' : 'TON'}
            maxBtn={true}
            maxValue={maxValue}></CustomInput>
          <img
            src={ArrowIcon}
            alt={'icon_arrow'}
            style={{
              width: '20px',
              height: '20px',
              marginLeft: '20px',
              marginRight: '20px',
            }}></img>
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={convertedTokenBalance}
            setValue={setConvertedTokenBalance}
            color={
              Number(inputTonBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            tokenName={tokenName}></CustomInput>
          <Flex pos="absolute" right={0} top={10} fontSize={'13px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Amount Available :{' '}
            </Text>
            <Text mr={'3px'}> {amountAvailable} </Text>
            <Text>{tokenName}</Text>
          </Flex>
        </Box>
      </Box>
      <Box d="flex" flexDir="column" w={'495px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
          Details
        </Text>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 1 Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {convertTimeStamp(startAddWhiteTime, 'YYYY-MM-D')} ~{' '}
              {convertTimeStamp(endExclusiveTime, 'MM-D')}
            </Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Your Allocation :{' '}
            </Text>
            <Text mr={'3px'}>
              {' '}
              {btnDisabled === true ? '-' : userAllocation}{' '}
            </Text>
            <Text>{tokenName}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              {`Tier Allocation(Tier: ${detailInfo?.userTier || '-'})`} :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {userTierAllocation}
            </Text>
            <Text>{tokenName}</Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Ratio :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              1 {fundingTokenType} = {tokenExRatio} {tokenName}
            </Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 1 :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {payAmount}
            </Text>
            <Text color={'gray.400'}>({saleAmount} TON)</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'27px'} h={'38px'} d="flex" alignItems="center">
        <DepositContainer
          amountAvailable={amountAvailable}
          btnDisabled={btnDisabled}
          inputTonBalance={inputTonBalance}
          saleContractAddress={saleContractAddress}
          wtonMode={wtonMode}></DepositContainer>
        <CustomButton
          w={'100px'}
          text="ton initialize"
          style={{marginLeft: '5px', marginRight: '5px'}}
          func={() => callTonDecreaseAllowance()}></CustomButton>
        <CustomButton
          w={'100px'}
          text="wton initialize"
          func={() => callWtonDecreaseAllowance()}></CustomButton>
        {/* {wtonMode === false ? } */}
        {/* {isApprove === true ? (
          <CustomButton
            text={'Acquire'}
            isDisabled={
              btnDisabled || Number(amountAvailable.replaceAll(',', '')) <= 0
            }
            func={() =>
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
              })
            }></CustomButton>
        ) : (
          <Flex alignItems="center">
            <CustomButton
              text={'TON Approve'}
              isDisabled={
                btnDisabled || Number(amountAvailable.replaceAll(',', '')) < 10
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
            <CustomButton
              text={'WTON Approve'}
              isDisabled={
                btnDisabled || Number(amountAvailable.replaceAll(',', '')) < 10
              }
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
              <Text color={colorMode === 'light' ? 'gray.250' : 'white.200'}>
                {' '}
                {wtonAllowance} WTON{' '}
              </Text>
            </Box>
          </Flex>
        )} */}
      </Box>
    </Flex>
  );
};
