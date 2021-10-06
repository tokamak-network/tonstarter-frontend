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
  import {CreateReward} from './components/CreateReward';
  import {
    chakra,
    // useTheme
  } from '@chakra-ui/react';

  type ManageContainerProps = {
    pools: any[];
  };

  export const ManageContainer: FC<ManageContainerProps> =({
    pools }) =>{

      useEffect (()=> {
        pools.map((item, index) =>{
          // console.log(item.name);
          
        })
        
      }, [pools])
        return (
            <Flex justifyContent={'space-between'} mt={'30px'}>
              <Flex>Manage reward container</Flex>
              <Flex>
              <CreateReward pools={pools}/>
              </Flex>
                
            </Flex>
        )
  }