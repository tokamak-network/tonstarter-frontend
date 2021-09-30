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
  import {
    chakra,
    // useTheme
  } from '@chakra-ui/react';

  type ManageContainerProps = {
      pools: any[];
  };

  export const ManageContainer: FC<ManageContainerProps> =({
    pools }) =>{
        return (
            <Flex>
                <Text>ManageContainer</Text>
            </Flex>
        )
  }