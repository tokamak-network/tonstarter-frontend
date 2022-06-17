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
  const [thisRound, setThisRound] = useState<string>('-');
  const [endRound, setEndRound] = useState<string>('-');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0');
  const [d_Day, setD_Day] = useState<number>(0);
  const [notRemained, setNotRemained] = useState<boolean>(true);
  const [isOverHardcap, setIsOverHardcap] = useState<boolean>(true);
  const [refundAmount, setRefundAmount] = useState<string>('0');
  const [hardCapAmount, setHardCapAmount] = useState<string>('-');
  const [totalRaisedAmount, setTotalRaisedAmount] = useState<string>('-');

  const {blockNumber} = useBlockNumber();

  const isOld =
    saleInfo.name === 'Door Open' || saleInfo.name === 'Dragons of Midgard';

  const PUBLICSALE_CONTRACT = useCallContract(
    saleInfo.saleContractAddress,
    'PUBLIC_SALE',
    isOld,
  );

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  //To check this project has got funding over hardcap or not
  useEffect(() => {
    async function checkHardCap() {
      if (PUBLICSALE_CONTRACT && account) {
        const isOver = await PUBLICSALE_CONTRACT.hardcapCalcul();

        if (Number(isOver.toString()) === 0) {
          if (
            saleInfo.name === 'DOOR OPEN' ||
            saleInfo.name === 'Dragons of Midgard'
          ) {
            return setIsOverHardcap(true);
          }
          const usersExAmount = await PUBLICSALE_CONTRACT.usersEx(account);
          const usersOpenAmount = await PUBLICSALE_CONTRACT.usersOpen(account);
          const hardCap = await PUBLICSALE_CONTRACT.hardCap();
          const totalExAmount =
            await PUBLICSALE_CONTRACT.totalExPurchasedAmount();
          const totalDepositAmount =
            await PUBLICSALE_CONTRACT.totalDepositAmount();

          //check if a user already get refund or not
          const usersClaim = await PUBLICSALE_CONTRACT.usersClaim(account);

          const totalRaisedWei =
            BigNumber.from(totalExAmount).add(totalDepositAmount);
          const refundAmountWei = BigNumber.from(usersExAmount.payAmount).add(
            usersOpenAmount.depositAmount,
          );
          const reundAmount = convertNumber({
            amount: refundAmountWei.toString(),
            localeString: true,
          });
          const hardCapAmount = convertNumber({
            amount: hardCap.toString(),
            localeString: true,
          });
          const totalRaisedAmount = convertNumber({
            amount: totalRaisedWei.toString(),
            localeString: true,
          });
          setRefundAmount(
            usersClaim.exec === true ? '0' : (reundAmount as string),
          );
          setHardCapAmount(hardCapAmount as string);
          setTotalRaisedAmount(totalRaisedAmount as string);
          setIsOverHardcap(false);
        } else {
          setIsOverHardcap(true);
        }
      }
    }
    checkHardCap();
  }, [PUBLICSALE_CONTRACT, account, saleInfo]);

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
        const nowTime = moment().unix();
        const totalRound = await PUBLICSALE_CONTRACT.totalClaimCounts();
        const totalRoundNum = Number(totalRound.toString()) - 1;

        let isEnd = false;
        let roundStart = 0;
        let vestingTimeStamp = 0;

        while (totalRoundNum + 1 > roundStart) {
          const claimTime = await PUBLICSALE_CONTRACT.claimTimes(roundStart);
          const claimTimeStamp = Number(claimTime.toString());
          if (claimTimeStamp > nowTime) {
            vestingTimeStamp = claimTimeStamp;
            break;
          }
          if (totalRoundNum === roundStart) {
            isEnd = true;
            break;
          }
          roundStart++;
        }

        setEndRound(String(totalRoundNum + 1));
        setThisRound(String(roundStart + 1));

        //currentRound() == totalClaimCounts();

        if (isEnd) {
          return setVestingDay('-');
        } else {
          setVestingDay(convertTimeStamp(vestingTimeStamp));
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
        try {
          const usersEx = await PUBLICSALE_CONTRACT.usersEx(account);
          const userOpenSaleUserAmount =
            await PUBLICSALE_CONTRACT.openSaleUserAmount(account);
          const usersClaim = await PUBLICSALE_CONTRACT.usersClaim(account);
          const totalClaim = await PUBLICSALE_CONTRACT.calculClaimAmount(
            account,
            0,
          );
          const totalSaleUserAmount =
            await PUBLICSALE_CONTRACT.totalSaleUserAmount(account);

          const userClaim = await PUBLICSALE_CONTRACT.usersClaim(account);

          const refundedAmount = BigNumber.from(
            userOpenSaleUserAmount._refundAmount,
          ).eq(userClaim.refundAmount);

          const ramainedAmount = BigNumber.from(totalClaim._totalClaim).sub(
            usersClaim.claimAmount,
          );

          const isRemainedZero = BigNumber.from(
            totalSaleUserAmount._realSaleAmount,
          ).eq(userClaim.claimAmount);

          const convertedExSaleAmount = convertNumber({
            amount: usersEx.saleAmount.toString(),
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
          setRemainedAmount(
            isRemainedZero ? '0.00' : convertedRamainedAmount || '0',
          );
          setOpenSale(convertedUsersOpen || '0');
          setWithdrawAmount(convertedUserRefund || '0');
        } catch (e) {
          console.log('**PUBLIC SALE CONTRACT ERROR**');
          console.log(e);
        }
      }
    }
    if (account && PUBLICSALE_CONTRACT) {
      getData();
    }
  }, [account, PUBLICSALE_CONTRACT, blockNumber, isOld]);

  if (isOverHardcap === false) {
    return (
      <Flex flexDir="column" pl={'45px'}>
        <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
          <Text
            {...STATER_STYLE.mainText({colorMode, fontSize: 25})}
            mr={'20px'}>
            Refund
          </Text>
        </Box>
        <Box d="flex">
          <Text
            color={colorMode === 'light' ? 'gray.375' : 'white.100'}
            fontSize={14}
            letterSpacing={'1.4px'}
            mb={'10px'}>
            Available to Refund
          </Text>
        </Box>
        <Box d="flex" alignItems="center" mb={'30px'}>
          <Box d="flex" mr={'10px'} alignItems="center">
            <CustomInput
              w={'220px'}
              h={'32px'}
              numberOnly={true}
              value={`${refundAmount} ${'TON'}`}
              color={
                Number(refundAmount) > 0
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
              <Text ml={'3px'}>{saleInfo?.tokenSymbol}</Text>
            </Flex>
            <Flex>
              <Text color={'gray.400'} mr={'3px'}>
                Minimum Fundraising Amount :{' '}
              </Text>
              <Text> {hardCapAmount}</Text>
              <Text ml={'3px'}>{'TON'}</Text>
            </Flex>
          </Box>
          <Box d="flex" fontSize={'13px'}>
            <Flex w={'226px'}>
              <Text color={'gray.400'} mr={'3px'}>
                Public Round 2 :{' '}
              </Text>
              <Text {...detailSubTextStyle}>{openSale}</Text>
              <Text ml={'3px'}>{saleInfo?.tokenSymbol}</Text>
            </Flex>
            <Flex pos={'relative'}>
              <Text color={'gray.400'} mr={'3px'}>
                Funding Raised :{' '}
              </Text>
              <Text {...detailSubTextStyle} mr={'5px'}>
                {totalRaisedAmount} TON
              </Text>
            </Flex>
          </Box>
          <Box d="flex" fontSize={'13px'} color={'#0070ed'}>
            <Text w={'226px'}>Minimum Fundraising Amount is not reached</Text>
            <Text>You can refund your funding crypto</Text>
          </Box>
        </Box>
        <Box mt={'29px'} d="flex">
          <CustomButton
            text={'Refund'}
            isDisabled={Number(refundAmount) <= 0}
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
        </Box>
      </Flex>
    );
  }

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
            value={`${inputTonBalance} ${saleInfo?.tokenSymbol}`}
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
            <Text ml={'3px'}>{saleInfo?.tokenSymbol}</Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Remained Amount :{' '}
            </Text>
            <Text> {remainedAmount}</Text>
            <Text ml={'3px'}>{saleInfo?.tokenSymbol}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'}>
          <Flex w={'226px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 2 :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{openSale}</Text>
            <Text ml={'3px'}>{saleInfo?.tokenSymbol}</Text>
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
            <Text {...detailSubTextStyle}>{thisRound}</Text>
            <Text mx={'3px'}>/</Text>
            <Text>{endRound}</Text>
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
