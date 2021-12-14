import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
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
import {BigNumber} from 'ethers';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {useERC20} from '@Starter/hooks/useERC20';
import useMaxValue from '@Starter/hooks/useMaxValue';

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
  const [isApprove, setIsApprove] = useState<boolean>(false);

  const {checkBalance} = useCheckBalance();
  const dispatch = useDispatch();

  const PUBLICSALE_CONTRACT = useCallContract(
    saleContractAddress,
    'PUBLIC_SALE',
  );

  const {tonBalance, wtonBalance, tonAllowance, wtonAllowance, totalAllowance} =
    useERC20(saleContractAddress);

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
        setBtnDisabled(!whiteListInfo[0]);
        // setAmountAvailable();
      }
    }
    if (account && library && saleContractAddress) {
      getInfo();
    }
  }, [account, library, saleContractAddress]);

  //check approve
  useEffect(() => {
    const numInputTonBalance = Number(inputTonBalance.replaceAll(',', ''));
    setIsApprove(totalAllowance >= numInputTonBalance);
  }, [account, library, totalAllowance, inputTonBalance]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Public Round 1
        </Text>
        <DetailCounter
          numberFontSize={'18px'}
          stringFontSize={'14px'}
          date={endExclusiveTime * 1000}></DetailCounter>
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
          (Your balance : {tonBalance} TON, {wtonBalance} WTON)
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
            tokenName={'TON'}
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
        {isApprove === true ? (
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
        )}
      </Box>
    </Flex>
  );
};
