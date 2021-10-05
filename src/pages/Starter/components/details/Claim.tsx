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

type ClaimProps = {
  saleInfo: AdminObject;
};

export const Claim: React.FC<ClaimProps> = (prop) => {
  const {saleInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();

  const [inputTonBalance, setInputTonBalance] = useState<string>('0');
  const [convertedTokenBalance, setConvertedTokenBalance] =
    useState<string>('0');

  const [saleStartTime, setSaleStartTime] = useState<string>('-');
  const [saleEndTime, setSaleEndTime] = useState<string>('-');
  const [userAllocation, setUserAllocation] = useState<string>('-');
  const [userTierAllocation, setUserTierAllocation] = useState<string>('-');

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  useEffect(() => {
    if (saleInfo) {
      const ratio = saleInfo.projectFundingTokenRatio;
      const result = Number(inputTonBalance) * ratio;
      setConvertedTokenBalance(String(result));
    }
  }, [inputTonBalance, saleInfo, convertedTokenBalance]);

  useEffect(() => {
    if (saleInfo) {
      const startTime = convertTimeStamp(saleInfo.startExclusiveTime);
      const endTime = convertTimeStamp(saleInfo.endOpenSaleTime, 'MM.DD');
      setSaleStartTime(startTime);
      setSaleEndTime(endTime);
    }
  }, [saleInfo]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Claim
        </Text>
        <DetailCounter
          numberFontSize={'18px'}
          stringFontSize={'14px'}
          date={
            saleInfo && convertTimeStamp(saleInfo.endOpenSaleTime, 'YYYY-MM-DD')
          }></DetailCounter>
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
            <Text {...detailSubTextStyle}>
              {saleStartTime} ~ {saleEndTime}
            </Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Remained Amount :{' '}
            </Text>
            <Text> {userAllocation}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Open Sale :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{userTierAllocation}</Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Next Vesting Date :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {saleInfo?.projectTokenRatio} TON ={' '}
              {saleInfo?.projectFundingTokenRatio} {saleInfo?.tokenName}
            </Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'46px'}>
        <CustomButton text={'Participate'}></CustomButton>
      </Box>
    </Flex>
  );
};
