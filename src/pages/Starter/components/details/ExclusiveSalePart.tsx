import {Box, useColorMode, useTheme, Flex, Text, Input} from '@chakra-ui/react';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useEffect, useRef, useState} from 'react';
import {DetailCounter} from './Detail_Counter';
import ArrowIcon from 'assets/svgs/arrow_icon.svg';
import {AdminObject} from '@Admin/types';
import {getUserTonBalance} from 'client/getUserBalance';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertTimeStamp} from 'utils/convertTIme';

type ExclusiveSalePartProps = {
  saleInfo: AdminObject;
};

export const ExclusiveSalePart: React.FC<ExclusiveSalePartProps> = (prop) => {
  const {saleInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();

  const [inputBalance, setInputBalance] = useState(0);

  const [saleStartTime, setSaleStartTime] = useState<string>('-');
  const [saleEndTime, setSaleEndTime] = useState<string>('-');
  const [userTonBalance, setUserTonBalance] = useState<string>('-');
  const [userAllocation, setUserAllocation] = useState<string>('-');
  const [userTierAllocation, setUserTierAllocation] = useState<string>('-');

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  const inputRef = useRef(null);

  useEffect(() => {
    console.log(inputRef);
    console.log(saleInfo);
  }, [inputRef]);

  useEffect(() => {
    if (saleInfo) {
      const startTime = convertTimeStamp(saleInfo.exclusiveStartTime);
      const endTime = convertTimeStamp(saleInfo.saleEndTime, 'MM.DD');
      setSaleStartTime(startTime);
      setSaleEndTime(endTime);
    }
  }, [saleInfo]);

  useEffect(() => {
    async function callUserBalance() {
      const tonBalance = await getUserTonBalance({account, library});
      return setUserTonBalance(tonBalance || '-');
    }
    callUserBalance();
  }, [account, library]);

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
            saleInfo && convertTimeStamp(saleInfo.saleEndTime, 'YYYY-MM-DD')
          }></DetailCounter>
      </Box>
      <Box d="flex">
        <Text
          {...STATER_STYLE.subText({colorMode})}
          letterSpacing={'1.4px'}
          color={'gray.375'}
          mb={'10px'}>
          Your Sale
        </Text>
        <Text
          {...STATER_STYLE.subText({colorMode})}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          (Your balance : {userTonBalance} TON)
        </Text>
      </Box>
      <Box d="flex" alignItems="center" mb={'30px'}>
        <Box d="flex" mr={'10px'} alignItems="center">
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={inputBalance}
            setValue={setInputBalance}></CustomInput>
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
            value={inputBalance}
            setValue={setInputBalance}></CustomInput>
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
              {saleStartTime} ~ {saleEndTime}
            </Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Your Allocation :{' '}
            </Text>
            <Text> {userAllocation}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Tier Allocation(Tier: x) :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{userTierAllocation}</Text>
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
      </Box>
      <Box mt={'46px'}>
        <CustomButton text={'Participate'}></CustomButton>
      </Box>
    </Flex>
  );
};
