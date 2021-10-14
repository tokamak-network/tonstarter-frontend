import {AdminObject} from '@Admin/types';
import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {getUserTonBalance} from 'client/getUserBalance';
import {CustomButton} from 'components/Basic/CustomButton';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailCounter} from './Detail_Counter';
import starterActions from '../../actions';
// import {useCheckBalance} from 'hooks/useCheckBalance';
import ArrowIcon from 'assets/svgs/arrow_icon.svg';
import {useBlockNumber} from 'hooks/useBlock';

type OpenSaleAfterDepositProp = {
  saleInfo: AdminObject;
  activeProjectInfo: any;
};

export const OpenSaleAfterDeposit: React.FC<OpenSaleAfterDepositProp> = (
  prop,
) => {
  const {saleInfo, activeProjectInfo} = prop;

  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const [inputBalance, setInputBalance] = useState(0);
  const [userTonBalance, setUserTonBalance] = useState<string>('-');
  const [totalAllocation, setTotalAllocation] = useState<string>('-');
  const [totalDeposit, setTotalDeposit] = useState<string>('-');
  const [yourDeposit, setYourDeposit] = useState<string>('-');
  const [fundingTokenBalance, setFundingTokenBalance] = useState<string>('-');

  // const {checkBalance} = useCheckBalance();

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  useEffect(() => {
    async function callUserBalance() {
      const tonBalance = await getUserTonBalance({account, library});
      return setUserTonBalance(tonBalance || '-');
    }
    if (account && library) {
      callUserBalance();
    }
  }, [account, library]);

  //call view funcions
  useEffect(() => {
    async function getData() {
      if (account && library && saleInfo) {
        const address = saleInfo.saleContractAddress;
        const res = await Promise.all([
          starterActions.getTotalExpectOpenSaleAmountView({
            library,
            address,
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
          starterActions.getCalCulSaleAmount({
            account,
            library,
            address,
          }),
          // starterActions.getRefundAmount({
          //   account,
          //   library,
          //   address,
          // }),
        ]);
        if (res) {
          //@ts-ignore
          setTotalAllocation(res[0]);
          //@ts-ignore
          setTotalDeposit(res[1]);
          //@ts-ignore
          setYourDeposit(res[2]);
          //@ts-ignore
          setFundingTokenBalance(res[3]);
        }
      }
    }
    if (account && library && saleInfo) {
      getData();
    }
  }, [account, library, saleInfo]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Public Round 2
        </Text>
        <DetailCounter
          numberFontSize={'18px'}
          stringFontSize={'14px'}
          date={Number(
            activeProjectInfo?.timeStamps.endOpenSaleTime + '000',
          )}></DetailCounter>
      </Box>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'10px'}>
        Your Deposit
      </Text>
      <Box d="flex" alignItems="center">
        <Box d="flex" mr={'10px'} alignItems="center" pos="relative">
          <Flex
            h={'36px'}
            {...STATER_STYLE.mainText({colorMode, fontSize: 28})}
            alignItems="baseline"
            m={0}>
            <Text mr={'8px'}>{yourDeposit}</Text>
            <Text fontSize={25}>TON</Text>
          </Flex>
          <img
            src={ArrowIcon}
            alt={'icon_arrow'}
            style={{
              width: '20px',
              height: '20px',
              marginLeft: '20px',
              marginRight: '20px',
              alignSelf: 'center',
            }}></img>
          <Flex
            h={'36px'}
            {...STATER_STYLE.mainText({colorMode, fontSize: 28})}
            alignItems="baseline">
            <Text mr={'8px'}>{fundingTokenBalance}</Text>
            <Text fontSize={25}>{saleInfo?.tokenName}</Text>
          </Flex>
        </Box>
      </Box>
      <Flex w={'235px'} mb={'25px'}>
        <Text color={'gray.400'} fontSize={13}>
          You will refund XXX,XXX TON
        </Text>
      </Flex>
      <Box d="flex" flexDir="column">
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
          Details
        </Text>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {convertTimeStamp(
                activeProjectInfo?.timeStamps?.startOpenSaleTime,
                'YYYY-MM-D',
              )}{' '}
              ~{' '}
              {convertTimeStamp(
                activeProjectInfo?.timeStamps?.endOpenSaleTime,
                'YYYY-MM-D',
              )}
            </Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Total Allocation :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{totalAllocation}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Total Deposited :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{totalDeposit}</Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Your Deposited :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{yourDeposit}</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'27px'}>
        <CustomButton
          text={'Sale'}
          func={() =>
            account &&
            starterActions.openSale({
              account,
              library,
              address: saleInfo?.saleContractAddress,
            })
          }></CustomButton>
      </Box>
    </Flex>
  );
};
