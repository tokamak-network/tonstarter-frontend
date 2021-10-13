import {Box, useColorMode, useTheme, Flex, Text, Input} from '@chakra-ui/react';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useEffect, useState} from 'react';
import {DetailCounter} from './Detail_Counter';
import ArrowIcon from 'assets/svgs/arrow_icon.svg';
import {AdminObject} from '@Admin/types';
import {getUserTonBalance} from 'client/getUserBalance';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailInfo} from '@Starter/types';
import {useCallContract} from 'hooks/useCallContract';
import {convertNumber} from 'utils/number';
import starterActions from '../../actions';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {useBlockNumber} from 'hooks/useBlock';

type ExclusiveSalePartProps = {
  saleInfo: AdminObject;
  detailInfo: DetailInfo;
  isApprove: boolean;
  activeProjectInfo: any;
};

export const ExclusiveSalePart: React.FC<ExclusiveSalePartProps> = (prop) => {
  const {saleInfo, detailInfo, isApprove, activeProjectInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();

  const [inputTonBalance, setInputTonBalance] = useState<string>('0');
  const [convertedTokenBalance, setConvertedTokenBalance] =
    useState<string>('0');

  const [amountAvailable, setAmountAvailable] = useState<string>('-');
  const [publicRound, setPublicRound] = useState<string>('-');
  const [userTonBalance, setUserTonBalance] = useState<string>('-');
  const [userAllocation, setUserAllocation] = useState<string>(
    detailInfo.tierAllocation[
      detailInfo.userTier !== 0 ? detailInfo.userTier : 1
    ],
  );
  const [userTierAllocation, setUserTierAllocation] = useState<string>('-');
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);

  const {checkBalance} = useCheckBalance();
  const {blockNumber} = useBlockNumber();

  const PUBLICSALE_CONTRACT = useCallContract(
    saleInfo.saleContractAddress,
    'PUBLIC_SALE',
  );

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  useEffect(() => {
    async function getTierAllowcation() {
      if (PUBLICSALE_CONTRACT) {
        const res = await PUBLICSALE_CONTRACT.totalExpectSaleAmount();
        //need to multiple
        setUserTierAllocation(
          convertNumber({amount: res.toString(), localeString: true}) as string,
        );
      }
    }
    if (account && library && PUBLICSALE_CONTRACT) {
      getTierAllowcation();
    }
  }, [account, library, PUBLICSALE_CONTRACT]);

  useEffect(() => {
    if (saleInfo) {
      const ratio = saleInfo.projectFundingTokenRatio;
      const result = Number(inputTonBalance) * ratio;
      setConvertedTokenBalance(String(result));
    }
  }, [inputTonBalance, saleInfo, convertedTokenBalance]);

  // useEffect(() => {
  //   if (saleInfo) {
  //     const startTime = convertTimeStamp(saleInfo.startExclusiveTime);
  //     const endTime = convertTimeStamp(saleInfo.endOpenSaleTime, 'MM.DD');
  //     setSaleStartTime(startTime);
  //     setSaleEndTime(endTime);
  //   }
  // }, [saleInfo]);

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

  useEffect(() => {
    async function getInfo() {
      if (account && library && activeProjectInfo) {
        const whiteListInfo = await starterActions.isWhiteList({
          account,
          library,
          address: activeProjectInfo.saleContractAddress,
        });
        // const amount = await starterActions.isWhiteList({
        //   account,
        //   library,
        //   address: activeProjectInfo.saleContractAddress,
        // });
        setBtnDisabled(!whiteListInfo[0]);
        // setAmountAvailable();
      }
    }
    if (account && library && activeProjectInfo) {
      getInfo();
    }
  }, [account, library, activeProjectInfo]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Exclusive Sale
        </Text>
        <DetailCounter
          numberFontSize={'18px'}
          stringFontSize={'14px'}
          date={
            activeProjectInfo?.timeStamps.endExclusiveTime * 1000
          }></DetailCounter>
      </Box>
      <Box d="flex">
        <Text
          color={colorMode === 'light' ? 'gray.375' : 'white.100'}
          fontSize={14}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          Buy Amount
        </Text>
        <Text
          {...STATER_STYLE.subText({colorMode: 'light'})}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          (Your balance : {userTonBalance} TON)
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
            tokenName={'TON'}></CustomInput>
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
            tokenName={saleInfo?.tokenName}></CustomInput>
          <Flex pos="absolute" right={0} top={10} fontSize={'13px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Amount Available :{' '}
            </Text>
            <Text mr={'3px'}> {amountAvailable} </Text>
            <Text>{saleInfo?.tokenName}</Text>
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
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {convertTimeStamp(
                activeProjectInfo?.timeStamps?.startExclusiveTime,
                'YYYY-MM-D',
              )}{' '}
              ~{' '}
              {convertTimeStamp(
                activeProjectInfo?.timeStamps?.endExclusiveTime,
                'MM-D',
              )}
            </Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Your Allocation :{' '}
            </Text>
            <Text mr={'3px'}> {userAllocation} </Text>
            <Text>{saleInfo?.tokenName}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              {`Tier Allocation(Tier: ${detailInfo.userTier})`} :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {userTierAllocation}
            </Text>
            <Text>{saleInfo?.tokenName}</Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Ratio :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {saleInfo?.projectTokenRatio} TON ={' '}
              {saleInfo?.projectFundingTokenRatio} {saleInfo?.tokenName}
            </Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 1 :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {userTierAllocation}
            </Text>
            <Text color={'gray.400'}>(XXX,XXX TON)</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'27px'}>
        {isApprove === true ? (
          <CustomButton
            text={'Buy'}
            isDisabled={btnDisabled}
            func={() =>
              account &&
              checkBalance(Number(inputTonBalance), Number(userTonBalance)) &&
              starterActions.participate({
                account,
                library,
                address: saleInfo.saleContractAddress,
                amount: inputTonBalance,
              })
            }></CustomButton>
        ) : (
          <CustomButton
            text={'Approve'}
            func={() =>
              account &&
              starterActions.getAllowance(
                account,
                library,
                saleInfo?.saleContractAddress,
              )
            }></CustomButton>
        )}
      </Box>
    </Flex>
  );
};
