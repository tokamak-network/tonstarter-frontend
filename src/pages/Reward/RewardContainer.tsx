import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
    Text,
    Flex,
    Select,
    Box,
    useColorMode,
  } from '@chakra-ui/react';
  import {useAppSelector} from 'hooks/useRedux';
  import {getPoolName} from '../../utils/token';
  import {ClaimReward} from './components/ClaimReward';

  import {
    chakra,
    // useTheme
  } from '@chakra-ui/react';

  type RewardContainerProps = {
      pools: any[];
  };

  export const RewardContainer: FC<RewardContainerProps> =({
    pools }) =>{
        return (
            <Flex justifyContent={'space-between'} mt={'30px'}>
               <Flex>Reward container</Flex>
              <Flex>
              <ClaimReward/>
              </Flex>
            </Flex>
        )
  }