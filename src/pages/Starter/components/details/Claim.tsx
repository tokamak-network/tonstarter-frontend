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
};

export const Claim: React.FC<ClaimProps> = (prop) => {
  const {saleInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();

  const [inputTonBalance, setInputTonBalance] = useState<string>('0');
  const [vestingDay, setVestingDay] = useState<string | 'end'>('-');
  const [exclusiveSale, setExclusiveSale] = useState<string>('-');
  const [remainedAmount, setRemainedAmount] = useState<string>('-');
  const [openSale, setOpenSale] = useState<string>('-');
  const [period, setPeriod] = useState<string>('-');
  const [endPeriod, setEndPeriod] = useState<string>('-');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0');
  const [d_Day, setD_Day] = useState<number>(0);
  const [notRemained, setNotRemained] = useState<boolean>(true);

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
        const period = parseInt(String(diffTime / intervalNum + 1));

        setPeriod(String(Math.floor(period)));
        setEndPeriod(endPeriod.toString());

        if (period < endPeriodNum) {
          const nextVestingDate = startClaimTimeNum + intervalNum * period;

          setD_Day(nextVestingDate);
          setVestingDay(
            convertTimeStamp(nextVestingDate, 'YYYY.MM.DD HH:mm:ss'),
          );
        } else {
          const nextVestingDate =
            startClaimTimeNum + intervalNum * endPeriodNum;

          setD_Day(nextVestingDate);
          setVestingDay(convertTimeStamp(nextVestingDate));
        }
      }
    }
    if (saleInfo && library && PUBLICSALE_CONTRACT) {
      getDate();
    }
  }, [library, saleInfo, PUBLICSALE_CONTRACT, blockNumber, d_Day]);

  useEffect(() => {
    async function getData() {
      if (account && PUBLICSALE_CONTRACT) {
        const usersEx = await PUBLICSALE_CONTRACT.usersEx(account);
        const userOpenSaleUserAmount =
          await PUBLICSALE_CONTRACT.openSaleUserAmount(account);
        const usersClaim = await PUBLICSALE_CONTRACT.usersClaim(account);
        const totalClaim = await PUBLICSALE_CONTRACT.calculClaimAmount(
          account,
          0,
        );

        const userClaim = await PUBLICSALE_CONTRACT.usersClaim(account);
        const refundedAmount = BigNumber.from(userOpenSaleUserAmount[2]).eq(
          userClaim.refundAmount,
        );

        const ramainedAmount = BigNumber.from(totalClaim[1]).sub(
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
          amount: userOpenSaleUserAmount[1].toString(),
          localeString: true,
        });
        const convertedUserRefund = convertNumber({
          amount: userOpenSaleUserAmount[2].toString(),
          localeString: true,
        });

        setNotRemained(refundedAmount);
        setExclusiveSale(convertedExSaleAmount || '0');
        setRemainedAmount(convertedRamainedAmount || '0');
        setOpenSale(convertedUsersOpen || '0');
        setWithdrawAmount(convertedUserRefund || '0');
      }
    }
    if (account && PUBLICSALE_CONTRACT) {
      getData();
    }
  }, [account, PUBLICSALE_CONTRACT, blockNumber]);

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
            value={`${inputTonBalance} ${saleInfo?.tokenName}`}
            color={
              Number(inputTonBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            // tokenName={`${saleInfo?.tokenName}`}
          ></CustomInput>
        </Box>
      </Box>
      <Box d="flex" flexDir="column" w={'495px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
          Details
        </Text>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'226px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 1 :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{exclusiveSale}</Text>
            <Text ml={'3px'}>{saleInfo?.tokenName}</Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Remained Amount :{' '}
            </Text>
            <Text> {remainedAmount}</Text>
            <Text ml={'3px'}>{saleInfo?.tokenName}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'226px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 2 :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{openSale}</Text>
            <Text ml={'3px'}>{saleInfo?.tokenName}</Text>
          </Flex>
          <Flex pos={'relative'}>
            <Text color={'gray.400'} mr={'3px'}>
              Next Vesting Date :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'5px'}>
              {vestingDay}
            </Text>
            {/* <DetailCounter
              style={{
                color: colorMode === 'light' ? '#3d495d' : '#ffffff',
                fontSize: '13px',
                position: 'absolute',
                right: -10,
                widht: '100px',
              }}
              date={1638691965}
              claimStep={true}></DetailCounter> */}
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Withdraw Claims :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {Number(period) > Number(endPeriod) ? endPeriod : period}
            </Text>
            <Text mx={'3px'}>/</Text>
            <Text>{endPeriod}</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'29px'} d="flex">
        <CustomButton
          text={'Claim'}
          isDisabled={Number(inputTonBalance) <= 0}
          style={{
            mr: '12px',
          }}
          func={() =>
            account &&
            starterActions.claim({
              account,
              library,
              address: saleInfo.saleContractAddress,
            })
          }></CustomButton>
        {notRemained ? null : (
          <Flex
            flexDir="column"
            ml={'15px'}
            fontSize={12}
            justifyContent="center">
            <Text color={'gray.400'} mr={'3px'}>
              WithdrawClaim Number :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{withdrawAmount} TON</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
