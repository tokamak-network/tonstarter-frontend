import {Box, useColorMode, useTheme, Flex, Text, Link} from '@chakra-ui/react';
import {DetailCounter} from './Detail_Counter';
import {CustomButton} from 'components/Basic/CustomButton';
import {AdminObject} from '@Admin/types';
import {convertTimeStamp} from 'utils/convertTIme';
import {useTime} from 'hooks/useTime';
// import {Link} from 'react-router-dom';
import {BASE_PROVIDER} from 'constants/index';
import {Tier, DetailInfo} from '@Starter/types';
import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useBlockNumber} from 'hooks/useBlock';

type WhiteListProps = {
  saleInfo: AdminObject;
  userTier: Tier;
  detailInfo: DetailInfo | undefined;
};

const Snapshot: React.FC<WhiteListProps> = (prop) => {
  const {saleInfo,userTier,detailInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const {STATER_STYLE} = theme;
  const {isPassed} = useTime(saleInfo?.snapshot);
  const network = BASE_PROVIDER._network.name;
  const [userAllocation, setUserAllocation] = useState<string>(
    detailInfo
      ? detailInfo.tierAllocation[
          detailInfo.userTier !== 0 ? detailInfo.userTier : 1
        ]
      : '0',
  );
  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  useEffect(() => {
    async function getInfo() {
      if (detailInfo) {
        setUserAllocation(
          detailInfo.tierAllocation[
            detailInfo.userTier !== 0 ? detailInfo.userTier : 1
          ],
        );
      }
    }
    if (account && library && saleInfo) {
      getInfo();
    }
  }, [account, library, saleInfo, blockNumber, detailInfo]);
  return (
    <Flex flexDir="column" pos="relative" h={'100%'} pt={'25px'} pl={'45px'}>
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mb={'5px'}>
        Snapshot
      </Text>
      <Text
        {...STATER_STYLE.subText({colorMode, fontSize: 14})}
        letterSpacing={'1.4px'}
        mb={'18px'}>
        Scheduled date and time
      </Text>
      <Box
        d="flex"
        flexDir={'column'}
        h={'65px'}
        {...STATER_STYLE.mainText({colorMode, fontSize: 34})}
        mt={'13px'}>
        <Text lineHeight={'1.12rem'}>
          {convertTimeStamp(saleInfo?.snapshot, 'YYYY.MM.DD HH:mm:ss')}
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
      <Box d="flex" flexDir="column" w={'495px'} mb='27px'>
          <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
            Details
          </Text>
          <Box d="flex" fontSize={'13px'}>
            <Flex mr={'25px'}>
              <Text color={'gray.400'} mr={'3px'}>
                Your Expected Tier :{' '}
              </Text>
              <Text {...detailSubTextStyle}>
                { `Tier ${detailInfo?.userTier}` }
              </Text>
            </Flex>
            <Flex w={'235px'}>
              <Text color={'gray.400'} mr={'3px'}>
                Expected Allocation :{' '}
              </Text>
              <Text mr={'3px'}> { userAllocation } </Text>
              <Text>{saleInfo?.tokenName}</Text>
            </Flex>
          </Box>
        </Box>
      <Link  isExternal href={network === 'goerli'? 'https://goerli.tosv2.tokamak.network/stake':'https://tosv2.tokamak.network/stake'}>
        <CustomButton
          w={'150px'}
          text={'Get sTOS'}
          func={() => {}}
          bgBlue={true}
          tooltip={'The higher the number of sTOS you have, the higher the tier you will be in, and the more tokens you will be allocated.'}
          style={{marginTop: '10px'}}></CustomButton>
      </Link>
    </Flex>
  );
};

export default Snapshot;
