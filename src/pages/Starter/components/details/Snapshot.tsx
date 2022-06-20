import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailCounter} from './Detail_Counter';
import {CustomButton} from 'components/Basic/CustomButton';
import {AdminObject} from '@Admin/types';
import {convertTimeStamp} from 'utils/convertTIme';
import {useTime} from 'hooks/useTime';
import {Link} from 'react-router-dom';

type WhiteListProps = {
  saleInfo: AdminObject;
};

const Snapshot: React.FC<WhiteListProps> = (prop) => {
  const {saleInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;
  const {isPassed} = useTime(saleInfo?.snapshot);

  return (
    <Flex flexDir="column" pos="relative" h={'100%'} pt={'75px'} pl={'45px'}>
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
        h={'82px'}
        {...STATER_STYLE.mainText({colorMode, fontSize: 34})}
        mt={'13px'}>
        <Text lineHeight={'1.12rem'}>
          {convertTimeStamp(saleInfo?.snapshot, 'YYYY.MM.DD hh:mm:ss')} (UTC)
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
      <Link to={`/dao`}>
        <CustomButton
          w={'150px'}
          text={'Get sTOS'}
          func={() => {}}
          style={{marginTop: 'auto', marginBottom: '3px'}}></CustomButton>
      </Link>
    </Flex>
  );
};

export default Snapshot;
