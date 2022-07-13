//MobileWtonTosLpReward
import {FC, useState, useEffect, Dispatch, SetStateAction} from 'react';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Link,
  GridItem,
  Grid,
  Button,
} from '@chakra-ui/react';
import {BASE_PROVIDER, DEPLOYED} from 'constants/index';
import {shortenAddress} from 'utils';
import {MobileVaultTable} from './MobileVaultTable';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {ethers} from 'ethers';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {interfaceReward} from 'pages/Reward/types';
import VaultLPRewardLogicAbi from 'services/abis/VaultLPRewardLogicAbi.json';
import * as UniswapV3FactoryABI from 'services/abis/UniswapV3Factory.json';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {soliditySha3} from 'web3-utils';
import {createReward, getRandomKey} from 'pages/Reward/components/api';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import views from 'pages//Reward/rewards';
const zero_address = '0x0000000000000000000000000000000000000000';
const {TOS_ADDRESS, UniswapV3Factory, NPM_Address, UniswapStaker_Address} =
  DEPLOYED;
const provider = BASE_PROVIDER;

type LiquidityIncentive = {
  vault: any;
  project: any;
};

type TokenCompProps = {
  vault: any;
  project: any;
  pool: string;
};

type Key = {
  rewardToken: string;
  pool: string;
  startTime: number;
  endTime: number;
  refundee: string;
};

type RewardCompProps = {
  vault: any;
  project: any;
  createRewardFirst: Dispatch<SetStateAction<any>>;
  refundFunc: Dispatch<SetStateAction<any>>;
  claimTime: number;
  disableButton: boolean;
  pool: string;
  duration: any[];
  getPaginatedData: () => interfaceReward[];
  pageLimit: number;
  setPageLimit: Dispatch<SetStateAction<any>>;
};
export const MobileLiquidityIncentive: FC<LiquidityIncentive> = ({
  vault,
  project,
}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [buttonState, setButtonState] = useState('Token');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(3);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const network = BASE_PROVIDER._network.name;
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const {account, library, chainId} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [distributeDisable, setDistributeDisable] = useState<boolean>(true);
  const [duration, setDuration] = useState<any[]>([0, 0]);
  const [pool, setPool] = useState<string>('');
  const [endTime, setEndTime] = useState<number>(0);
  const [poolsFromAPI, setPoolsFromAPI] = useState<any>([]);
  const [datas, setDatas] = useState<interfaceReward[] | []>([]);
  const zero_address = '0x0000000000000000000000000000000000000000';
  const VaultLPReward = new Contract(
    vault.vaultAddress,
    VaultLPRewardLogicAbi.abi,
    library,
  );

  const UniswapV3Fact = new Contract(
    UniswapV3Factory,
    UniswapV3FactoryABI.abi,
    library,
  );

  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );

  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const now = moment().unix();
      const currentRound = await VaultLPReward.currentRound();
      const nowClaimRound = await VaultLPReward.nowClaimRound();
      const totalClaimCount = await VaultLPReward.totalClaimCounts();
      const available = await VaultLPReward.availableUseAmount(currentRound);
      const amountFormatted = parseInt(ethers.utils.formatEther(available));
      const getProgramDuration = await VaultLPReward.getProgramDuration(
        currentRound,
      );
      const claimDate =
        nowClaimRound === totalClaimCount
          ? 0
          : await VaultLPReward.claimTimes(nowClaimRound);
      const endTime = Number(claimDate) + Number(getProgramDuration);
      const durat = [Number(claimDate), endTime];
      setEndTime(Number(getProgramDuration));

      setDuration(durat);
      const getPool = await UniswapV3Fact.getPool(
        TOS_ADDRESS,
        project.tokenAddress,
        3000,
      );
      setPool(getPool);
      // console.log(Number(nowClaimRound), 'Number(nowClaimRound)');
      // console.log(Number(currentRound), 'Number(currentRound)');
      // console.log(amountFormatted);
      // console.log(Number(claimDate) > now);
      // console.log(moment().unix() > duration[1]);

      const disabled = Number(nowClaimRound) >= Number(currentRound);

      setShowDate(amountFormatted === 0 && Number(claimDate) > now);
      setClaimTime(claimDate);
      setDistributable(amountFormatted);
      setDisableButton(
        disabled || (amountFormatted === 0 && Number(claimDate) > now),
      );
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber, vault.vaultAddress]);

  async function fetchProjectsData() {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    const rewardData = await views.getRewardData();
    if (rewardData) {
      const res = await Promise.all(
        rewardData.map(async (reward: any, index: number) => {
          reward.index = index + 1;
          const key = reward.incentiveKey;
          const abicoder = ethers.utils.defaultAbiCoder;
          const incentiveABI =
            'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';

          const incentiveId = soliditySha3(
            abicoder.encode([incentiveABI], [key]),
          );
          const incentiveInfo = await uniswapStakerContract
            .connect(signer)
            .incentives(incentiveId);
          reward.unclaimed = incentiveInfo.totalRewardUnclaimed;
          return {...reward};
        }),
      );

      const filtered = rewardData.filter(
        (reward: any) =>
          ethers.utils.getAddress(reward.incentiveKey.refundee) ===
          ethers.utils.getAddress(vault.vaultAddress),
      );

      setDatas(filtered);
    }
  }
  useEffect(() => {
    fetchProjectsData();
  }, [account, library, vault.vaultAddress, transactionType, blockNumber]);

  const generateSig = async (account: string, key: any) => {
    const randomvalue = await getRandomKey(account);
    // const pool = '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf';
    //@ts-ignore
    const web3 = new Web3(window.ethereum);
    if (randomvalue != null) {
      const randomBn = new BigNumber(randomvalue).toFixed(0);
      const soliditySha3 = await web3.utils.soliditySha3(
        {type: 'string', value: account},
        {type: 'uint256', value: randomBn},
        {type: 'string', value: key.rewardToken},
        {type: 'string', value: key.pool},
        {type: 'uint256', value: key.startTime},
        {type: 'uint256', value: key.endTime},
      );
      //@ts-ignore
      const sig = await web3.eth.personal.sign(soliditySha3, account, '');

      return sig;
    } else {
      return '';
    }
  };
  const createRewardFirst = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);

    try {
      const receipt = await VaultLPReward.connect(signer).createProgram();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        const res = await receipt.wait();
        const blockNum = res.blockNumber;
        const block = await provider.getBlock(blockNum);
        const timeStamp = block.timestamp;
        const startTime = Number(timeStamp) + 60;
        const endTimestamp = endTime;
        const poolAddress = pool;
        const rewardToken = project.tokenAddress;
        const refundee = vault.vaultAddress;
        const allocatedReward = ethers.utils.parseEther(
          distributable.toString(),
        );
        const poolName = `TOS / ${project.tokenSymbol}`;
        const key = {
          rewardToken: rewardToken,
          pool: poolAddress,
          startTime: startTime,
          endTime: startTime + endTime,
          refundee: refundee,
        };
        const sig = await generateSig(account.toLowerCase(), key);
        const arg = {
          poolName: poolName,
          poolAddress: poolAddress,
          rewardToken: rewardToken,
          account: account.toLowerCase(),
          incentiveKey: key,
          startTime: startTime,
          endTime: startTime + endTime,
          allocatedReward: allocatedReward.toString(),
          numStakers: 0,
          status: 'open',
          verified: true,
          tx: receipt,
          sig: sig,
        };
        const create = await createReward(arg);
        console.log('create', create);

        if (create.success === true) {
          fetchProjectsData();
        }
      }
    } catch (e) {
      console.log(e);

      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  };

  const refundFunc = async (key: Key) => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      const receipt = await uniswapStakerContract
        .connect(signer)
        .endIncentive(key);
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Reward');
      }
    } catch (e) {
      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  };

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return datas.slice(startIndex, endIndex);
  };

  return (
    <Flex mt={'35px'} flexDir={'column'} px={'20px'}>
      <Flex
        mx={'auto'}
        mb={'20px'}
        fontFamily={theme.fonts.fld}
        fontSize="13px"
        alignItems={'center'}>
        <Text
          px={'12px'}
          _active={{color: colorMode === 'light' ? '#304156' : '#ffffff'}}
          onClick={() => setButtonState('Token')}
          fontWeight={buttonState === 'Token' ? 'bold' : 'normal'}
          color={
            buttonState === 'Token'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }>
          Token
        </Text>
        <Box
          h={'9px'}
          w={'1px'}
          border={
            colorMode === 'light'
              ? '0.5px solid #d7d9df'
              : '0.5px solid #373737'
          }></Box>
        <Text
          px={'12px'}
          fontWeight={buttonState === 'Rewards' ? 'bold' : 'normal'}
          color={
            buttonState === 'Rewards'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('Rewards')}>
          Liquidity Rewards Program
        </Text>
      </Flex>
      {buttonState === 'Token' ? (
        <TokenComp vault={vault} project={project} pool={pool} />
      ) : (
        <RewardComp
          vault={vault}
          project={project}
          createRewardFirst={createRewardFirst}
          refundFunc={refundFunc}
          claimTime={claimTime}
          disableButton={disableButton}
          pool={pool}
          duration={duration}
          getPaginatedData={getPaginatedData}
          pageLimit={pageLimit}
          setPageLimit={setPageLimit}
        />
      )}
      <MobileVaultTable claim={vault.claim} />
    </Flex>
  );
};

const RewardComp: React.FC<RewardCompProps> = ({
  vault,
  project,
  createRewardFirst,
  refundFunc,
  claimTime,
  disableButton,
  pool,
  duration,
  getPaginatedData,
  pageLimit,
  setPageLimit
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };

  return (
    <Flex flexDir={'column'}>
      {claimTime !== 0 ? (
        <Flex justifyContent={'space-between'} w={'100%'} mb={'20px'}>
          <Flex flexDir={'column'}>
            <Text
              fontFamily={theme.fonts.roboto}
              fontSize="12px"
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              {' '}
              You can create rewards program on
            </Text>
            <Text
              fontSize="12px"
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              fontFamily={theme.fonts.roboto}>
              {' '}
              {moment.unix(claimTime).format('MMM. DD, yyyy HH:mm:ss')} (
              {momentTZ.tz(momentTZ.tz.guess()).zoneAbbr()})
            </Text>
          </Flex>
          <Button
            bg={'#257eee'}
            fontSize={'12px'}
            height={'40px'}
            width={'116px'}
            padding={'6px 12px'}
            whiteSpace={'normal'}
            color={'#fff'}
            fontWeight={500}
            isDisabled={disableButton || pool === zero_address}
            _disabled={{
              color: colorMode === 'light' ? '#86929d' : '#838383',
              bg: colorMode === 'light' ? '#e9edf1' : '#353535',
              cursor: 'not-allowed',
            }}
            _hover={
              disableButton || pool === zero_address
                ? {}
                : {
                    cursor: 'pointer',
                  }
            }
            _active={
              disableButton || pool === zero_address
                ? {}
                : {
                    background: '#2a72e5',
                    border: 'solid 1px #2a72e5',
                    color: '#fff',
                  }
            }
            onClick={createRewardFirst}>
            Create Reward Program
          </Button>
        </Flex>
      ) : (
        <></>
      )}
      <Grid
        w={'100%'}
        h={'100%'}
        bg={colorMode === 'light' ? '#fff' : 'transparent'}
        boxShadow={
          colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
        }
        border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
        borderRadius="15px">
        <GridItem
          style={gridItemStyle}
          h="60px"
          borderBottom={
            colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
          }>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize="14px"
            color={colorMode === 'light' ? '#353c48' : '#fff'}
            fontWeight={600}>
            Liquidity Rewards program Listed
          </Text>
        </GridItem>
        {getPaginatedData().map((reward: any, index: number) => {
          return (
            <GridItem
              style={gridItemStyle}
              h={'100%'}
              pt={'13px'}
              pb={'15px'}
              borderBottom={ index === getPaginatedData().length-1? 'none' :
                colorMode === 'light'
                  ? '1px solid #e6eaee'
                  : '1px solid #373737'
              }
              >
              <Flex w="100%" flexDir={'row'} justifyContent={'space-between'}>
                <Text
                  fontFamily={theme.fonts.fld}
                  fontSize="20px"
                  color={colorMode === 'light' ? '#353c48' : '#fff'}>
                  #{reward.index}
                </Text>
                <Flex flexDir={'column'}>
                  <Flex flexDir={'column'} mb="15px">
                    <Text
                      fontFamily={theme.fonts.fld}
                      fontSize="12px"
                      color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                      Reward Duration
                    </Text>
                    <Text style={rightText}>
                      {moment.unix(reward.startTime).format('yyyy.MM.DD HH:mm')}{' '}
                      - {moment.unix(reward.endTime).format('yyyy.MM.DD HH:mm')}
                    </Text>
                  </Flex>
                  <Flex flexDir={'row'}>
                    <Flex flexDir={'column'}>
                    <Text
                      fontFamily={theme.fonts.fld}
                      fontSize="12px"
                      color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
                      Refundable Amount
                    </Text>
                    <Text style={rightText}> {Number(
                        ethers.utils.formatEther(reward.unclaimed),
                      ).toLocaleString()}{project.tokenSymbol}</Text>
                      </Flex>
                      <Button
                  bg={'#257eee'}
                  ml={'23px'}
                  fontSize={'12px'}
                  padding={'6px 41px 5px'}
                  height={'32px'}
                  borderRadius={'4px'}
                  width={'100px'}
                  color={'#fff'}
                  isDisabled={Number(reward.unclaimed) === 0 || moment().unix() < reward.endTime}
                  _disabled={{
                    color: colorMode === 'light' ? '#86929d' : '#838383',
                    bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                    cursor: 'not-allowed',
                  }}
                  _hover={
                    // I set !disableButton just for UI testing purposes. Revert to disableButton (or any condition) to disable _hover and _active styles.
                    Number(reward.unclaimed) === 0
                      ? {}
                      : {}
                  }
                  _active={
                    Number(reward.unclaimed) === 0
                      ? {}
                      : {}
                  }
                  onClick={() => refundFunc(reward.incentiveKey)}>
                  Refund
                </Button>
                  </Flex>
                </Flex>
              </Flex>
            </GridItem>
          );
        })}
      </Grid>
      <Button
          w={'100%'}
          h={'45px'}
          mt={'10px'}
          justifyContent={'center'}
          alignItems={'center'}
          border={
            colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #535353'
          }
          borderRadius={'15px'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          bg={colorMode === 'light' ? '#fff' : 'transparent'}
          color={colorMode === 'light' ? '#86929d' : '#dee4ef'}
          _focus={{}}
          _active={{}}
          onClick={() => setPageLimit(pageLimit+3)}
          >
          MORE +
        </Button>
    </Flex>
  );
};

const TokenComp: React.FC<TokenCompProps> = ({vault, project, pool}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };
  return (
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        {' '}
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          Token
        </Text>
        {vault.isDeployed ? (
          <Flex>
            <Text letterSpacing={'1.3px'} style={rightText} mr={'5px'}>
              {Number(vault.vaultTokenAllocation).toLocaleString()}{' '}
              {project.tokenSymbol}
            </Text>
            <Text
              fontFamily={theme.fonts.fld}
              letterSpacing={'1.3px'}
              fontSize={'14px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              {'('}
              {(
                (vault.vaultTokenAllocation / project.totalTokenAllocation) *
                100
              )
                .toString()
                .match(/^\d+(?:\.\d{0,2})?/)}
              {'%)'}
            </Text>
          </Flex>
        ) : (
          <></>
        )}
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>Selected Pair</Text>

        <Text style={rightText}>{project.tokenSymbol} - TOS</Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex flexDir={'column'}>
          <Text style={leftText} w={'103px'}>
            Pool Address
          </Text>
          <Text style={leftText} w={'103px'}>
            (0.3% fee)
          </Text>
        </Flex>

        <Link
          isExternal
          href={
            pool !== zero_address
              ? `https://info.uniswap.org/#/pools/${pool.toLowerCase()}`
              : ''
          }
          _hover={{color: '#2a72e5'}}
          style={rightText}
          textDecor="underline">
          {pool !== zero_address ? shortenAddress(pool) : 'NA'}
        </Link>
      </GridItem>

      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Vault Admin Address
        </Text>
        <Link
          isExternal
          href={
            vault.adminAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.adminAddress}`
              : vault.adminAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.adminAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'NA'}
        </Link>
      </GridItem>
      <GridItem style={gridItemStyle}>
        <Text style={leftText} w={'103px'}>
          Vault Contract Address
        </Text>
        <Link
          isExternal
          href={
            vault.vaultAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.vaultAddress}`
              : vault.vaultAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.vaultAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'NA'}
        </Link>
      </GridItem>
    </Grid>
  );
};
