import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailCounter} from './Detail_Counter';
import {CustomButton} from 'components/Basic/CustomButton';
import starterActions from '../../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {Tier, DetailInfo} from '@Starter/types';
import {AdminObject} from '@Admin/types';
import {convertTimeStamp} from 'utils/convertTIme';
import {useBlockNumber} from 'hooks/useBlock';
import {useTime} from 'hooks/useTime';

type WhiteListProps = {
  userTier: Tier;
  detailInfo: DetailInfo | undefined;
  saleInfo: AdminObject;
};

export const WhiteList: React.FC<WhiteListProps> = (prop) => {
  const {userTier, detailInfo, saleInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [isWhiteList, setIsWhiteList] = useState<boolean>(false);

  const {STATER_STYLE} = theme;
  const {blockNumber} = useBlockNumber();
  const {isPassed} = useTime(saleInfo?.startAddWhiteTime);
  const [userAllocation, setUserAllocation] = useState<string>(
    detailInfo
      ? detailInfo.tierAllocation[
          detailInfo.userTier !== 0 ? detailInfo.userTier : 1
        ]
      : '0',
  );

  useEffect(() => {
    async function getInfo() {
      if (account && library && saleInfo) {
        const whiteListInfo = await starterActions.isWhiteList({
          account,
          library,
          address: saleInfo.saleContractAddress,
        });
        setIsWhiteList(whiteListInfo[0]);
        if (detailInfo) {
          setUserAllocation(
            detailInfo.tierAllocation[
              detailInfo.userTier !== 0 ? detailInfo.userTier : 1
            ],
          );
        }
      }
    }
    if (account && library && saleInfo) {
      getInfo();
    }
  }, [account, library, saleInfo, blockNumber, detailInfo]);

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  return (
    <Flex
      flexDir="column"
      pos="relative"
      h={'100%'}
      pt={isPassed ? '0px' : '70px'}
      pl={'45px'}>
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mb={'5px'}>
        Exclusive Sale Whitelist
      </Text>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'11px'}
        m={0}>
        Period Information
      </Text>
      <Box d="flex" {...STATER_STYLE.mainText({colorMode, fontSize: 34})}>
        <Text mr={'10px'}>
          {convertTimeStamp(saleInfo?.startAddWhiteTime)} ~{' '}
          {convertTimeStamp(saleInfo?.endExclusiveTime, 'MM.D')}
        </Text>
        <Box display={isPassed ? '' : 'none'} w={'255px'}>
          <DetailCounter
            date={saleInfo?.endAddWhiteTime * 1000}></DetailCounter>
        </Box>
        <Box display={isPassed ? 'none' : ''} w={'255px'}>
          <DetailCounter
            date={saleInfo?.startAddWhiteTime * 1000}></DetailCounter>
        </Box>
      </Box>
      {isPassed && (
        <Box d="flex" flexDir="column" w={'495px'} mt={'30px'}>
          <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
            Details
          </Text>
          <Box d="flex" fontSize={'13px'}>
            <Flex mr={'25px'}>
              <Text color={'gray.400'} mr={'3px'}>
                Your Expected Tier :{' '}
              </Text>
              <Text {...detailSubTextStyle}>
                {isWhiteList ? `Tier${detailInfo?.userTier}` : '-'}
              </Text>
            </Flex>
            <Flex w={'235px'}>
              <Text color={'gray.400'} mr={'3px'}>
                Expected Allocation :{' '}
              </Text>
              <Text mr={'3px'}> {isWhiteList ? userAllocation : '-'} </Text>
              <Text>{saleInfo?.tokenName}</Text>
            </Flex>
          </Box>
        </Box>
      )}
      <Box pos="absolute" bottom={'13px'}>
        {isPassed ? (
          <CustomButton
            w={'180px'}
            text={'whitelist me'}
            func={() =>
              account &&
              starterActions.addWhiteList({
                account,
                library,
                address: saleInfo.saleContractAddress,
              })
            }
            isDisabled={
              userTier === 0 || isWhiteList ? true : false
            }></CustomButton>
        ) : null}
      </Box>
    </Flex>
  );
};
