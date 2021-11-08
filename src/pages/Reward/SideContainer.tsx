import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
  Image,
  Input,
} from '@chakra-ui/react';

import {FC, useRef, useState, useEffect} from 'react';
import {PoolComponent} from './components/PoolComponent';
import {ClaimReward} from './components/ClaimReward';
import {CreateReward} from './components/CreateReward';
import {LPTokenComponent} from './components/LPTokenComponent'
type SideContainerProps = {
  selected: string;
  pools: any[];
  rewards: any[];
  LPTokens: any[];
};
export const SideContainer: FC<SideContainerProps> = ({selected, pools, rewards, LPTokens}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  return (
    <Box
      display={'flex'}
      flexDir={'column'}
      boxShadow={'0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
      border={colorMode === 'light' ? '' : '1px solid #535353'}
      w={'284px'}
      pt={'20px'}
      pb={'30px'}
      borderRadius={'15px'}
      bg={colorMode === 'light' ? '#FFFFFF' : ''} mb={'20px'}>
      <Box>
        {selected === 'reward' ? (
          <ClaimReward rewards={rewards} />
        ) : (
          <CreateReward pools={pools} />
        )}
      </Box>

      <PoolComponent pools={pools} rewards={rewards} />
      <LPTokenComponent tokens={LPTokens} />
    </Box>
  );
};
