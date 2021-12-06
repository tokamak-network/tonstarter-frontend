import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
  Text,
  Flex,
  Select,
  Box,
  useColorMode,
  useTheme,
  Grid,
  IconButton,
  Tooltip,
  Center,
} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {getPoolName} from '../../utils/token';
import {CreateReward} from './components/CreateReward';
import {RewardProgramCardManage} from './components/RewardProgramCardManage';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';

import {
  chakra,
  // useTheme
} from '@chakra-ui/react';
type Pool = {
  id: string;
  liquidity: string;
  poolDayData: [];
  tick: string;
  token0: Token;
  token1: Token;
  token0Image: string;
  token1Image: string
};
type Token = {
  id: string;
  symbol: string;
};
type ManageContainerProps = {
  rewards: any[];
  position?: string;
  selectedPool?: Pool;
  pools: Pool[];
  sortString: string
};

export const ManageContainer: FC<ManageContainerProps> = ({
  rewards,
  pools,
  position,
  selectedPool,
  sortString
}) => {

  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6);
  useEffect(() => {
    setPageIndex(1)
    const pagenumber = parseInt(
      ((rewards.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  
  }, [rewards, pageLimit]);

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return rewards.slice(startIndex, endIndex);
  };
  useEffect(()=> {
    setPageIndex(1)
    
  },[selectedPool, sortString, pageLimit])
  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const {colorMode} = useColorMode();
  const theme = useTheme();

  return (
    <Flex justifyContent={'space-between'}>
      {rewards.length !==0? 
      <Box flexWrap={'wrap'}>
        <Grid templateColumns="repeat(2, 1fr)" gap={30} h={'fit-content'}  mb={'30px'}>
          {getPaginatedData().map((reward: any, index) => {
            let token0;
            let token1;
            let token0Image;
            let token1Image
            const includedPool = pools.filter((pool: any) => pool.id === reward.poolAddress);
            token0 = includedPool[0].token0.id;
              token1 = includedPool[0].token1.id;
              token0Image = includedPool[0].token0Image;
              token1Image = includedPool[0].token1Image;
            const rewardProps = {
              chainId: reward.chainId,
              poolName: reward.poolName,
              token0Address: token0,
              token1Address: token1,
              token0Image: token0Image,
              token1Image: token1Image,
              poolAddress: reward.poolAddress,
              rewardToken: reward.rewardToken,
              incentiveKey: reward.incentiveKey,
              startTime: reward.startTime,
              endTime: reward.endTime,
              allocatedReward: reward.allocatedReward,
              numStakers: reward.numStakers,
              status: reward.status,
            };
            return (
              <RewardProgramCardManage
                key={index}
                reward={rewardProps}
                selectedToken={Number(position)}
                pageIndex={pageIndex}
                sortString={sortString}
              />
            );
          })}
        </Grid>
        <Flex mt={'22px'} position={'relative'}>
          <Flex flexDirection={'row'} h={'25px'} alignItems={'center'}>
            <Flex>
              <Tooltip label="Previous Page">
                <IconButton
                  minW={'24px'}
                  h={'24px'}
                  bg={colorMode === 'light' ? 'white.100' : 'none'}
                  border={
                    colorMode === 'light'
                      ? 'solid 1px #e6eaee'
                      : 'solid 1px #424242'
                  }
                  color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                  borderRadius={4}
                  aria-label={'Previous Page'}
                  onClick={gotToPreviousPage}
                  isDisabled={pageIndex === 1}
                  size={'sm'}
                  mr={4}
                  _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                  icon={<ChevronLeftIcon h={6} w={6} />}
                />
              </Tooltip>
            </Flex>
            <Flex
              alignItems="center"
              p={0}
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#3a495f' : '#949494'}>
              <Text flexShrink={0}>
                Page{' '}
                <Text fontWeight="bold" as="span" color={'blue.300'}>
                  {pageIndex}
                </Text>{' '}
                of{' '}
                <Text fontWeight="bold" as="span">
                  {pageOptions}
                </Text>
              </Text>
            </Flex>
            <Flex>
              <Tooltip label="Next Page">
                <Center>
                  <IconButton
                    minW={'24px'}
                    h={'24px'}
                    border={
                      colorMode === 'light'
                        ? 'solid 1px #e6eaee'
                        : 'solid 1px #424242'
                    }
                    color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                    bg={colorMode === 'light' ? 'white.100' : 'none'}
                    borderRadius={4}
                    aria-label={'Next Page'}
                    onClick={goToNextPage}
                    isDisabled={pageIndex === pageOptions}
                    size={'sm'}
                    ml={4}
                    mr={'1.5625em'}
                    _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                    icon={<ChevronRightIcon h={6} w={6} />}
                  />
                </Center>
              </Tooltip>
              <Select
                w={'117px'}
                h={'32px'}
                mr={1}
                color={colorMode === 'light' ? ' #3e495c' : '#f3f4f1'}
                bg={colorMode === 'light' ? 'white.100' : 'none'}
                boxShadow={
                  colorMode === 'light'
                    ? '0 1px 1px 0 rgba(96, 97, 112, 0.14)'
                    : ''
                }
                border={colorMode === 'light' ? '' : 'solid 1px #424242'}
                borderRadius={4}
                size={'sm'}
                value={pageLimit}
                fontFamily={theme.fonts.roboto}
                onChange={(e) => {
                  setPageIndex(1)
                  setPageLimit(Number(e.target.value));
                }}>
                {[2, 4, 6, 8, 10, 12].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
        </Flex>
      </Box> :<Flex> <Text fontFamily={theme.fonts.fld} fontSize={'20px'}>You don't have any reward programs to refund</Text> </Flex>}
      
    </Flex>
  );
};