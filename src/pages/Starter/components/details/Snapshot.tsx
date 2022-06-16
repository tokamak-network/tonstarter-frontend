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
  saleInfo: AdminObject;
};

const Snapshot: React.FC<WhiteListProps> = (prop) => {
  const {saleInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  return (
    <Flex flexDir="column" pos="relative" h={'100%'} pt={'70px'} pl={'45px'}>
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mb={'5px'}>
        Snapshot
      </Text>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'11px'}
        m={0}>
        Scheduled date and time
      </Text>
      <Box d="flex" {...STATER_STYLE.mainText({colorMode, fontSize: 34})}>
        <Text mr={'10px'}>
          {convertTimeStamp(saleInfo?.startAddWhiteTime)} ~{' '}
          {convertTimeStamp(saleInfo?.endExclusiveTime, 'MM.D')}
        </Text>
      </Box>
    </Flex>
  );
};

export default Snapshot;
