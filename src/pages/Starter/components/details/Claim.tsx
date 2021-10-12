import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useEffect, useState} from 'react';
import {AdminObject} from '@Admin/types';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertTimeStamp} from 'utils/convertTIme';
import starterActions from '../../actions';
import moment from 'moment';
import {useCallContract} from 'hooks/useCallContract';
import {BigNumber} from 'ethers';
import {convertNumber} from 'utils/number';
import {useBlockNumber} from 'hooks/useBlock';

type ClaimProps = {
  saleInfo: AdminObject;
  activeProjectInfo: any;
};

export const Claim: React.FC<ClaimProps> = (prop) => {
  const {saleInfo, activeProjectInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();

  const [inputTonBalance, setInputTonBalance] = useState<string>('0');
  const [vestingDay, setVestingDay] = useState<string>('-');
  const [exclusiveSale, setExclusiveSale] = useState<string>('-');
  const [remainedAmount, setRemainedAmount] = useState<string>('-');
  const [openSale, setOpenSale] = useState<string>('-');

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
    async function getData() {
      if (account && library && saleInfo) {
        const userClaimAmount = await starterActions.getCalculClaimAmount({
          account,
          library,
          address: saleInfo.saleContractAddress,
        });
        setInputTonBalance(userClaimAmount || '0');
      }
    }
    if (account && library) {
      getData();
    }
  }, [account, library, saleInfo, blockNumber]);

  useEffect(() => {
    async function getDate() {
      if (PUBLICSALE_CONTRACT) {
        const startClaimTime = await PUBLICSALE_CONTRACT.startClaimTime();
        const startClaimTimeNum = Number(startClaimTime.toString());
        const nowTime = moment().unix();
        const diffTime = nowTime - startClaimTimeNum;
        const interval = await PUBLICSALE_CONTRACT.claimInterval();
        const intervalNum = Number(interval.toString());
        const endPeriod = await PUBLICSALE_CONTRACT.claimPeriod();
        const endPeriodNum = Number(endPeriod.toString());
        const period = diffTime / intervalNum + 1;

        if (period > endPeriodNum) {
          const nextVestingDate = startClaimTimeNum + intervalNum * period;
          setVestingDay(convertTimeStamp(nextVestingDate));
        } else {
          const nextVestingDate =
            startClaimTimeNum + intervalNum * endPeriodNum;
          setVestingDay(convertTimeStamp(nextVestingDate));
        }
      }
    }
    if (saleInfo && library && PUBLICSALE_CONTRACT) {
      getDate();
    }
  }, [library, saleInfo, PUBLICSALE_CONTRACT]);

  useEffect(() => {
    async function getData() {
      if (account && PUBLICSALE_CONTRACT) {
        const usersEx = await PUBLICSALE_CONTRACT.usersEx(account);
        const usersOpen = await PUBLICSALE_CONTRACT.usersOpen(account);
        const usersClaim = await PUBLICSALE_CONTRACT.usersClaim(account);
        // const ramainedAmount =
        //   Number(usersClaim?.totalClaimReward.toString()) -
        //   Number(usersClaim?.claimAmount.toString());

        const ramainedAmount = BigNumber.from(usersClaim?.totalClaimReward).sub(
          usersClaim?.claimAmount,
        );

        const convertedExSaleAmount = convertNumber({
          amount: usersEx?.saleAmount.toString(),
          localeString: true,
        });
        const convertedRamainedAmount = convertNumber({
          amount: String(ramainedAmount),
          localeString: true,
        });
        const convertedUsersOpen = convertNumber({
          amount: usersOpen?.saleAmount.toString(),
          localeString: true,
        });

        setExclusiveSale(convertedExSaleAmount || '0');
        setRemainedAmount(convertedRamainedAmount || '0');
        setOpenSale(convertedUsersOpen || '0');
      }
    }
    if (account && PUBLICSALE_CONTRACT) {
      getData();
    }
  }, [account, PUBLICSALE_CONTRACT]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Claim
        </Text>
      </Box>
      <Box d="flex">
        <Text
          color={colorMode === 'light' ? 'gray.375' : 'white.100'}
          fontSize={14}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          Available to Claim
        </Text>
      </Box>
      <Box d="flex" alignItems="center" mb={'30px'}>
        <Box d="flex" mr={'10px'} alignItems="center">
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={inputTonBalance}
            color={
              Number(inputTonBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            tokenName={`${saleInfo?.tokenName}`}></CustomInput>
        </Box>
      </Box>
      <Box d="flex" flexDir="column" w={'495px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
          Details
        </Text>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Exclusive Sale :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{exclusiveSale}</Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Remained Amount :{' '}
            </Text>
            <Text> {remainedAmount}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Open Sale :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{openSale}</Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Next Vesting Date :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{vestingDay}</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'46px'}>
        <CustomButton
          text={'Claim'}
          isDisabled={Number(inputTonBalance) <= 0}
          func={() =>
            account &&
            starterActions.claim({
              account,
              library,
              address: saleInfo.saleContractAddress,
            })
          }></CustomButton>
      </Box>
    </Flex>
  );
};
