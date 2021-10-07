import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailCounter} from './Detail_Counter';
import {CustomButton} from 'components/Basic/CustomButton';
import starterActions from '../../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {Tier} from '@Starter/types';

type WhiteListProps = {
  date: string;
  startDate: string;
  endDate: string;
  userTier: Tier;
};

export const WhiteList: React.FC<WhiteListProps> = (prop) => {
  const {date, startDate, endDate, userTier} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [isWhiteList, setIsWhiteList] = useState<boolean>(true);

  const {STATER_STYLE} = theme;

  useEffect(() => {
    async function getInfo() {
      if (account && library) {
        const whiteListInfo = await starterActions.isWhiteList({
          account,
          library,
        });
        setIsWhiteList(whiteListInfo[0]);
      }
    }
    if (account && library) {
      getInfo();
    }
  }, [account, library]);

  return (
    <Flex flexDir="column" pos="relative" h={'100%'} pt={'70px'} pl={'45px'}>
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mb={'5px'}>
        Exclusive Sale Whitelist
      </Text>
      <Text
        // {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'11px'}
        m={0}>
        Period Information
      </Text>
      <Box d="flex" {...STATER_STYLE.mainText({colorMode, fontSize: 34})}>
        <Text mr={'25px'}>
          {startDate} ~ {endDate}
        </Text>
        <DetailCounter date={date}></DetailCounter>
      </Box>
      <Box pos="absolute" bottom={'13px'}>
        <CustomButton
          text={'Add whitelist'}
          func={() =>
            account && starterActions.addWhiteList({account, library})
          }
          isDisabled={
            userTier === 0 || isWhiteList ? true : false
          }></CustomButton>
      </Box>
    </Flex>
  );
};
