import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
  Text,
  Grid,
  Flex,
  Select,
  Box,
  IconButton,
  Tooltip,
  useColorMode,
  useTheme,
  Center,
} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {getPoolName} from '../../utils/token';
import {ClaimReward} from './components/ClaimReward';
import {RewardProgramCard} from './components/RewardProgramCard';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {
  chakra,
  // useTheme
} from '@chakra-ui/react';

type RewardContainerProps = {
  pools: any[];
};
type Reward = {
  chainId: Number;
  poolName: String;
  token1Address: string;
  token2Address: string;
  poolAddress: String;
  rewardToken: String;
  incentiveKey: Object;
  startTime: Number;
  endTime: Number;
  allocatedReward: String;
  numStakers: Number;
  status: String;
};
export const RewardContainer: FC<RewardContainerProps> = ({pools}) => {
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6)
  useEffect(() => {
    const pagenumber = parseInt(((pools.length-1)/pageLimit + 1).toString());
   setPageOptions(pagenumber)
    
    // console.log(pools);
  }, [pools, pageLimit]);


  const getPaginatedData = () => {
    const startIndex = (pageIndex * pageLimit ) - pageLimit;
    const endIndex = startIndex + pageLimit;
    return pools.slice(startIndex, endIndex);
  }

  const goToNextPage = () => {
    setPageIndex(pageIndex+1);
  }

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex-1);
  }

  const {colorMode} = useColorMode();
  const theme = useTheme();

  return (
    <Flex justifyContent={'space-between'} mb="100px" mt={'30px'}>
      <Flex flexWrap={'wrap'}>
        <Grid templateColumns="repeat(2, 1fr)" gap={30}>
          {getPaginatedData().map((pool, index) => {
            const rewardProps = {
              chainId: pool.chainId,
              poolName: pool.poolName,
              token1Address: '0x0000000000000000000000000000000000000000',
              token2Address: '0x73a54e5C054aA64C1AE7373C2B5474d8AFEa08bd',
              poolAddress: pool.poolAddress,
              rewardToken: pool.rewardToken,
              incentiveKey: pool.incentiveKey,
              startTime: pool.startTime,
              endTime: pool.endTime,
              allocatedReward: pool.allocatedReward,
              numStakers: pool.numStakers,
              status: pool.status,
            };
            return <RewardProgramCard reward={rewardProps} />;
          })}
        </Grid>
        <Flex mt={'22px'} position={'relative'}>
        <Flex flexDirection={'row'} h={'25px'} alignItems={'center'}>
        <Flex>
          <Tooltip label="Previous Page">
            <IconButton
              w={'24px'}
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
                w={'24px'}
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
      </Flex>
      <Flex>
        <ClaimReward />
      </Flex>
     
    </Flex>
  );
};
