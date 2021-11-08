import {FC, useState, useEffect} from 'react';
import {
  Text,
  Flex,
  Box,
  useColorMode,
  useTheme,
  Grid,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {openModal} from 'store/modal.reducer';
// import { getPoolName } from '../../utils/token';
import {stake, unstake, approve} from '../actions';
import {convertNumber} from '../../../utils/number';
import {selectTransactionType} from 'store/refetch.reducer';
import {fetchPositionRangePayload} from '../utils/fetchPositionRangePayload';
import {ethers} from 'ethers';
import {useActiveWeb3React} from 'hooks/useWeb3';

type LiquidityPositionProps = {
  stakingDisable: boolean;
  owner: string;
  lpData: any;
  poolName: string;
  id: string;
};

const getCircle = (type: 'staked' | 'not staked') => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'16px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={type === 'staked' ? '#73d500' : '#f95359'}></Box>
    </Flex>
  );
};

const getRange = (type: 'range' | 'not range') => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'4px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={type === 'range' ? '#2ea2f8' : '#ff7800'}></Box>
    </Flex>
  );
};

export const LiquidityPosition: FC<LiquidityPositionProps> = ({
  owner,
  stakingDisable,
  poolName,
  lpData,
  id,
}) => {
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {btnStyle} = theme;
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [stakingBtnDisable, setStakingBtnDisable] = useState(true);
  const [unStakingBtnDisable, setUnStakingBtnDisable] = useState(true);
  const [claimBtnDisable, setClaimBtnDisable] = useState(true);
  const {account: address, library} = useActiveWeb3React();
  const localBtnStyled = {
    btn: () => ({
      bg: 'blue.500',
      color: 'white.100',
      borderRadius: '4px',
      w: '125px',
      h: '38px',
      py: '10px',
      px: '29.5px',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: '500',
      _hover: {backgroundColor: 'blue.100'},
    }),
  };

  const [range, setRange] = useState(false);
  const [approval, setApproval] = useState(false);
  const [swapableAmount, setSwapableAmount] = useState<string | undefined>('0');

  const rangePayload = async (args: any) => {
    const {address, library, id} = args;
    const result = await fetchPositionRangePayload(library, id, address);

    return result;
  };

  // const { miningAmount } = lpData;

  useEffect(() => {
    async function getRange() {
      if (id && address && library) {
        const result = await rangePayload({library, id, address});
        if (result) {
          const {range, approved} = result;
          const inRange = range !== undefined ? range : false;
          setRange(inRange);
          setApproval(approved);
        }
        return result;
      }
    }

    async function setStakingBtn() {
      const inRange = await getRange();
      if (
        address &&
        owner === address.toLowerCase() &&
        !stakingDisable &&
        inRange
      ) {
        setStakingBtnDisable(false);
      } else {
        setStakingBtnDisable(true);
      }
    }

    async function setUnStakingBtn() {
      if (address && owner !== address.toLowerCase()) {
        setUnStakingBtnDisable(false);
      } else {
        setUnStakingBtnDisable(true);
      }
    }

    function setClaimBtn() {
      if (address && owner !== address.toLowerCase() && lpData) {
        setClaimBtnDisable(false);
      } else {
        setClaimBtnDisable(true);
      }
    }

    function setSwapable() {
      const claimed = lpData?.miningAmount;
      const expected = lpData?.minableAmount;
      if (claimed && expected) {
        const addedValue = claimed.add(expected);
        const expectedAmount = ethers.utils.formatUnits(addedValue, 18);
        setSwapableAmount(Number(expectedAmount).toFixed(9));
      }
    }

    getRange();
    setSwapable();
    setStakingBtn();
    setUnStakingBtn();
    setClaimBtn();
  }, [
    lpData,
    stakingDisable,
    transactionType,
    blockNumber,
    address,
    id,
    library,
    owner,
  ]);
console.log('blockNumber', blockNumber);

  const tooltipMsg = () => {
    return (
      <Flex flexDir="column" fontSize="12px" pt="6px" pl="5px" pr="5px">
        <Text textAlign="center" fontSize="12px">
          After LP staking, you cannot adjust the position through Uniswap.
        </Text>
        <Text textAlign="center">
          You must first unstake and adjust the position.
        </Text>
        <Text textAlign="center">
          We are still developing a function for increasing/decreasing liquidity
        </Text>
        <Text textAlign="center">
          while LP is still staked. But if you want to provide liquidity with
          different
        </Text>
        <Text textAlign="center">
          price range, you must create new position in Uniswap.
        </Text>
      </Flex>
    );
  };

  return (
    <Flex justifyContent={'space-between'}>
      {!address
        ? ''
        : owner === address.toLowerCase()
        ? getCircle('not staked')
        : getCircle('staked')}
      {range ? getRange('range') : getRange('not range')}
      <Flex ml={'32px'} w={'170px'} mr={'33px'} py={2}>
        <Text>{poolName}</Text>
        <Text fontSize={'14px'} pt={1}>
          _#{id}
        </Text>
      </Flex>
      <Flex
        alignContent={'center'}
        fontWeight={300}
        fontSize={'12px'}
        direction={'row'}
        w={'185px'}
        mr={'0px'}
        py={3}>
        <Text color={'#2a72e5'} mr={1}>
          TOS Earned{' '}
        </Text>
        <Text>
          <>
            {' '}
            {lpData
              ? convertNumber({amount: lpData.claimedAmount.toString()})
              : '0.00'}{' '}
            TOS{' '}
          </>
        </Text>
      </Flex>
      <Grid
        pos="relative"
        templateColumns={'repeat(5, 1fr)'}
        gap={3}
        w={'575px'}
        mr={'4px'}>
        <Button
          {...localBtnStyled.btn()}
          color={'#838383'}
          {...(claimBtnDisable
            ? {...btnStyle.btnDisable({colorMode})}
            : {...btnStyle.btnAble()})}
          isDisabled={claimBtnDisable}
          onClick={() =>
            dispatch(
              openModal({
                type: 'claimPool',
                data: {
                  id: id,
                  swapableAmount: swapableAmount,
                  earned: convertNumber({
                    amount: lpData.claimedAmount.toString(),
                  }),
                },
              }),
            )
          }>
          Claim
        </Button>
        <>
          {approval ? (
            <Tooltip
              hasArrow
              placement="bottom"
              maxW={415}
              w={415}
              h="105px"
              label={tooltipMsg()}
              color={theme.colors.white[100]}
              bg={theme.colors.gray[375]}
              p={0}
              borderRadius={3}
              fontSize="12px">
              <Button
                {...localBtnStyled.btn()}
                {...(stakingBtnDisable
                  ? {...btnStyle.btnDisable({colorMode})}
                  : {...btnStyle.btnAble()})}
                isDisabled={stakingBtnDisable}
                onClick={() =>
                  stake({
                    tokenId: id,
                    userAddress: address,
                    library: library,
                  })
                }>
                Stake
              </Button>
            </Tooltip>
          ) : (
            <Button
              {...localBtnStyled.btn()}
              {...(stakingBtnDisable
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={stakingBtnDisable}
              onClick={() =>
                approve({
                  tokenId: id,
                  userAddress: address,
                  library: library,
                })
              }>
              Approve
            </Button>
          )}
        </>
        {/* <Button
          {...localBtnStyled.btn()}
          {...(stakingBtnDisable
            ? {...btnStyle.btnDisable({colorMode})}
            : {...btnStyle.btnAble()})}
          isDisabled={stakingBtnDisable}
          onClick={() => approval ?
            stake({
              tokenId: id,
              userAddress: address,
              library: library,
            }) :
            approve({
              tokenId: id,
              userAddress: address,
              library: library,
            })
          }>
          {approval ? 'Stake ': 'Approve'}
        </Button> */}
        <Button
          {...localBtnStyled.btn()}
          {...(unStakingBtnDisable
            ? {...btnStyle.btnDisable({colorMode})}
            : {...btnStyle.btnAble()})}
          disabled={unStakingBtnDisable}
          onClick={() =>
            unstake({
              tokenId: id,
              userAddress: address,
              library: library,
              miningAmount: lpData.miningAmount,
            })
          }>
          Unstake
        </Button>
        <Button
          {...localBtnStyled.btn()}
          bg={'#00c3c4'}
          _hover={{bg: '#00b3b4'}}
          // _hover={bg: 'blue.100'}
          onClick={(e: any) => {
            e.preventDefault();
            window.open(`https://app.uniswap.org/#/pool/${id}`);
          }}>
          Edit
        </Button>
      </Grid>
    </Flex>
  );
};
