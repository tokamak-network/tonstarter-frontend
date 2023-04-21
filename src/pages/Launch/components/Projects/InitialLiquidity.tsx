import {FC, useEffect, useState, Dispatch, SetStateAction} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Button,
  Link,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import * as LiquidityIncentiveAbi from 'services/abis/LiquidityIncentiveAbi.json';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import InitialLiquidityAbi from 'services/abis/Vault_InitialLiquidity.json';
import {shortenAddress} from 'utils/address';
import commafy from 'utils/commafy';
import {getSigner} from 'utils/contract';
import InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as UniswapV3FactoryABI from 'services/abis/UniswapV3Factory.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {convertToWei} from 'utils/number';
import {ethers} from 'ethers';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {BASE_PROVIDER} from 'constants/index';
import Fraction from 'fraction.js';
import {addPool} from 'pages/Admin/actions/actions';
import {ZERO_ADDRESS} from 'constants/misc';
import moment from 'moment';
import * as UniswapV3PoolABI from 'services/abis/UniswapV3Pool.json';
import {useBlockNumber} from 'hooks/useBlock';

const univ3prices = require('@thanpolas/univ3prices');

// var Fraction = require('fraction.js');
const {TOS_ADDRESS, UniswapV3Factory, NPM_Address} = DEPLOYED;
type InitialLiquidity = {
  vault: any;
  project: any;
};

type Condition1 = {
  themeDesign: any;
  projTokenBalance: string;
  tosBalance: string;
};

type Condition2 = {
  themeDesign: any;
  projTokenBalance: string;
  tosBalance: string;
  project: any;
  isAdmin: boolean;
  InitialLiquidityCompute: any;
  pool: string;
  startTime: number;
};
type Condition3 = {
  themeDesign: any;
  projTokenBalance: string;
  tosBalance: string;
  project: any;
  isAdmin: boolean;
  InitialLiquidityCompute: any;
  createdPool: any;
  mint: Dispatch<SetStateAction<any>>;
};
type Condition4 = {
  themeDesign: any;
  projTokenBalance: string;
  tosBalance: string;
  project: any;
  isAdmin: boolean;
  LPToken: Number;
  mint: Dispatch<SetStateAction<any>>;
  collect: Dispatch<SetStateAction<any>>;
  npm: any;
};
export const InitialLiquidity: FC<InitialLiquidity> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {transactionType} = useAppSelector(selectTransactionType);
  const {account, library, chainId} = useActiveWeb3React();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [tosBalance, setTosBalance] = useState<string>('');
  const [projTokenBalance, setProjTokenBalance] = useState<string>('');
  const [isPool, setIsPool] = useState<boolean>(false);
  const [isLpToken, setIsLpToken] = useState<boolean>(false);
  const [LPToken, setLPToken] = useState<Number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [createdPool, setCreatedPool] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const {blockNumber} = useBlockNumber();
  const [tosAmnt, setTosAmnt] = useState(0);
  const network = BASE_PROVIDER._network.name;
  const InitialLiquidityCompute = new Contract(
    vault.vaultAddress,
    InitialLiquidityComputeAbi.abi,
    library,
  );
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const TOS = new Contract(TOS_ADDRESS, ERC20.abi, library);
  const UniswapV3Fact = new Contract(
    UniswapV3Factory,
    UniswapV3FactoryABI.abi,
    library,
  );
  const projectToken = new Contract(project.tokenAddress, ERC20.abi, library);
  const NPM = new Contract(NPM_Address, NPMABI.abi, library);
  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
      const LP = await InitialLiquidityCompute.lpToken();
      const pool = await InitialLiquidityCompute.pool();
      const start = await InitialLiquidityCompute.startTime();
      setStartTime(start);
      const tosBal = await TOS.balanceOf(vault.vaultAddress);
      const tokBalance = await projectToken.balanceOf(vault.vaultAddress);
      const TOSBal = ethers.utils.formatEther(tosBal);
      setTosBalance(TOSBal);
      setProjTokenBalance(ethers.utils.formatEther(tokBalance));
      const getPool = await UniswapV3Fact.getPool(
        TOS_ADDRESS,
        project.tokenAddress,
        3000,
      );
      setIsPool(pool === ZERO_ADDRESS ? false : true);
      setCreatedPool(pool === ZERO_ADDRESS ? '' : pool);
      // setIsPool(false)
      setIsLpToken(Number(LP) === 0 ? false : true);

      setLPToken(Number(LP));
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber]);

  useEffect(() => {
    if (account !== undefined && account !== null) {
      if (
        ethers.utils.getAddress(account) ===
        ethers.utils.getAddress(project.owner)
      ) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [account, project]);

  useEffect(() => {
    async function getTosAmount() {
      if (
        account === null ||
        account === undefined ||
        library === undefined ||
        createdPool === ''
      ) {
        return;
      }

      const pool = new Contract(createdPool, UniswapV3PoolABI.abi, library);
      const slot0 = await pool.slot0();
      // console.log(slot0);
      const token0 = await pool.token0();
      const token1 = await pool.token1();
      // console.log('token0', token0);
      // console.log('token1', token1);
      const token0Contract = new Contract(token0, ERC20.abi, library);
      const token1Contract = new Contract(token1, ERC20.abi, library);
      const amount0Balance = await token0Contract.balanceOf(vault.vaultAddress);
      const amount1Balance = await token1Contract.balanceOf(vault.vaultAddress);
      // console.log('amount0Balance', Number(amount0Balance));
      // console.log('amount1Balance', Number(amount1Balance));
      const sqrtRatio = slot0.sqrtPriceX96;
      const price = univ3prices([18, 18], sqrtRatio).toAuto();
      // console.log('sqrtRatio', sqrtRatio);
      // console.log('price', price);
      let tosAmount = 0;
      if (TOS_ADDRESS.toLowerCase() === token0.toLowerCase()) {
        const priceUpdated = price * 1e18;
        let inToken0Amount = amount1Balance
          .mul(ethers.BigNumber.from(priceUpdated + ''))
          .div(ethers.utils.parseEther('1'));
        inToken0Amount = inToken0Amount;
        // console.log('amount1Balance', amount1Balance.toString());
        // console.log('inToken0Amount', inToken0Amount.toString());
        tosAmount = inToken0Amount;
      } else {
        const reversePrice = 1 / (price * 1e18);
        let inToken1Amount = amount0Balance
          .mul(ethers.BigNumber.from(reversePrice + ''))
          .div(ethers.utils.parseEther('1'));
        inToken1Amount = inToken1Amount;
        // console.log('amount0Balance', amount0Balance.toString());
        // console.log('inToken0Amount', inToken1Amount.toString());
        tosAmount = inToken1Amount;
      }

      // console.log('tosAmount', tosAmount);
      setTosAmnt(tosAmount)
    }
    getTosAmount();
  }, [account, createdPool, library, vault.vaultAddress, blockNumber]);
  const mint = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      // const bal = await TOS.balanceOf(vault.vaultAddress);

      const receipt = await InitialLiquidityCompute.connect(signer).mint(tosAmnt.toString());
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
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
  const collect = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      const receipt = await InitialLiquidityCompute.connect(signer).collect();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
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

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: '#2a72e5',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
    headerFont: {
      light: '#353c48',
      dark: '#fff',
    },
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" w={'100%'}>
      <Flex flexDirection={'column'}>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}
          fontSize={'16px'}>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize={'15px'}
            color={themeDesign.headerFont[colorMode]}
            letterSpacing={'1.5px'}>
            Token
          </Text>
          {/* Need to make TON changeable. */}
          <Flex alignItems={'center'}>
            <Text
              fontFamily={theme.fonts.fld}
              fontSize={'13px'}
              color={themeDesign.headerFont[colorMode]}
              letterSpacing={'1.3px'}
              mr={'5px'}>
              {commafy(Number(vault.vaultTokenAllocation))}{' '}
              {project.tokenSymbol}
            </Text>
            <Text letterSpacing={'1.3px'} fontSize={'13px'} color={'#7e8993'}>
              {(
                (vault.vaultTokenAllocation / project.totalTokenAllocation) *
                100
              )
                .toString()
                .match(/^\d+(?:\.\d{0,2})?/)}
              %
            </Text>
          </Flex>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Price Range</Text>
          {/* Need to make Full Range changeable. */}
          <Text fontFamily={theme.fonts.fld}>Full Range</Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Selected Pair</Text>
          {/* Need to make Token Symbol - TOS changeable. */}
          <Text fontFamily={theme.fonts.fld}> {project.tokenSymbol} - TOS</Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Pool Address</Text>
          {/* Need a valid poolAddress */}
          <Link
            isExternal
            href={
              createdPool !== ''
                ? `https://info.uniswap.org/#/pools/${createdPool.toLowerCase()}`
                : ''
            }
            _hover={{color: '#2a72e5'}}
            fontFamily={theme.fonts.fld}>
            {createdPool !== '' ? shortenAddress(createdPool) : 'NA'}
          </Link>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          borderBottom={'none'}
          className={'chart-cell no-border-right no-border-bottom'}>
          <Text fontFamily={theme.fonts.fld}>Vault Admin</Text>
          <Link
            isExternal
            href={
              vault.adminAddress && network === 'goerli'
                ? `https://goerli.etherscan.io/address/${vault.adminAddress}`
                : vault.adminAddress && network !== 'goerli'
                ? `https://etherscan.io/address/${vault.adminAddress}`
                : ''
            }
            _hover={{color: '#2a72e5'}}
            fontFamily={theme.fonts.fld}>
            {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'NA'}
          </Link>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderRight={'none'}
          className={'chart-cell no-border-right'}>
          <Text fontFamily={theme.fonts.fld}>Vault Contract Address</Text>
          <Text fontFamily={theme.fonts.fld}>
            <Link
              isExternal
              href={
                vault.vaultAddress && network === 'goerli'
                  ? `https://goerli.etherscan.io/address/${vault.vaultAddress}`
                  : vault.vaultAddress && network !== 'goerli'
                  ? `https://etherscan.io/address/${vault.vaultAddress}`
                  : ''
              }
              _hover={{color: '#2a72e5'}}
              fontFamily={theme.fonts.fld}>
              {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'NA'}
            </Link>
          </Text>{' '}
        </GridItem>
      </Flex>
      {Number(tosBalance) === 0 ? (
        isPool && isLpToken ? (
          <Condition4
            themeDesign={themeDesign}
            projTokenBalance={projTokenBalance}
            tosBalance={tosBalance}
            project={project}
            isAdmin={isAdmin}
            LPToken={LPToken}
            mint={mint}
            collect={collect}
            npm={NPM}
          />
        ) : (
          <Condition1
            themeDesign={themeDesign}
            projTokenBalance={projTokenBalance}
            tosBalance={tosBalance}
          />
        )
      ) : isPool ? (
        isLpToken ? (
          <Condition4
            themeDesign={themeDesign}
            projTokenBalance={projTokenBalance}
            tosBalance={tosBalance}
            project={project}
            isAdmin={isAdmin}
            LPToken={LPToken}
            mint={mint}
            collect={collect}
            npm={NPM}
          />
        ) : (
          <Condition3
            themeDesign={themeDesign}
            projTokenBalance={projTokenBalance}
            tosBalance={tosBalance}
            project={project}
            isAdmin={isAdmin}
            InitialLiquidityCompute={InitialLiquidityCompute}
            mint={mint}
            createdPool={createdPool}
          />
        )
      ) : (
        <Condition2
          themeDesign={themeDesign}
          projTokenBalance={projTokenBalance}
          tosBalance={tosBalance}
          project={project}
          isAdmin={isAdmin}
          InitialLiquidityCompute={InitialLiquidityCompute}
          pool={createdPool}
          startTime={startTime}
        />
      )}
    </Grid>
  );
};

export const Condition1: React.FC<Condition1> = ({
  themeDesign,
  projTokenBalance,
  tosBalance,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Flex flexDirection={'column'}>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}
        fontSize={'16px'}>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize={'15px'}
          color={themeDesign.headerFont[colorMode]}
          letterSpacing={'1.5px'}>
          LP Token
        </Text>
        <Text
          fontSize={'12px'}
          mr={'5px'}
          color={colorMode === 'light' ? '#7e8993' : ''}>
          Please send TOS from Public sale Vault to Initial Liquidity vault
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text w={'29.2%'} fontFamily={theme.fonts.fld} color={'#7e8993'}>
          LP Token
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'35.4%'}
          color={'#7e8993'}
          textAlign={'center'}>
          Project Token
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'35.4%'}
          color={'#7e8993'}
          textAlign={'center'}>
          TOS
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text
          color={colorMode === 'light' ? '#7e8993' : ''}
          fontFamily={theme.fonts.fld}
          w={'29.2%'}>
          Amount in Initial Liquidity Vault
        </Text>
        <Text
          textAlign={'center'}
          w={'35.4%'}
          fontFamily={theme.fonts.fld}
          fontSize={'14px'}
          letterSpacing={'0.14px'}>
          {Number(projTokenBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Text
          textAlign={'center'}
          w={'35.4%'}
          fontFamily={theme.fonts.fld}
          fontSize={'14px'}
          letterSpacing={'0.14px'}>
          {Number(tosBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text fontFamily={theme.fonts.fld}>{''}</Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        className={'chart-cell'}
        borderBottom={'none'}>
        <Text fontFamily={theme.fonts.fld}>{''}</Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        className={'chart-cell no-border-bottom'}>
        <Text fontFamily={theme.fonts.fld}>{''}</Text>
      </GridItem>
    </Flex>
  );
};

export const Condition2: React.FC<Condition2> = ({
  themeDesign,
  projTokenBalance,
  tosBalance,
  project,
  isAdmin,
  InitialLiquidityCompute,
  pool,
  startTime,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const now = moment().unix();
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const {account, library, chainId} = useActiveWeb3React();
  const bn = require('bignumber.js');
  useEffect(() => {
    getRatio();
  }, [account, project]);

  useEffect(() => {}, []);

  const encodePriceSqrt = (reserve1: number, reserve0: number) => {
    return new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toFixed();
  };
  const createPool = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);

    const computePoolAddress = await InitialLiquidityCompute.connect(
      signer,
    ).computePoolAddress(TOS_ADDRESS, project.tokenAddress, 3000);

    try {
      const receipt = await InitialLiquidityCompute.connect(
        signer,
      ).setCreatePool();
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
        if (chainId) {
          const createPoo = addPool({
            chainId: chainId,
            poolName: `TOS / ${project.tokenSymbol}`,
            poolAddress: computePoolAddress[0],
            token0Address: TOS_ADDRESS,
            token1Address: project.tokenAddress,
            token0Image:
              'https://tonstarter-symbols.s3.ap-northeast-2.amazonaws.com/tos-symbol%403x.png',
            token1Image: project.tokenSymbolImage,
            feeTier: 3000,
          });
        }
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
  const getRatio = () => {
    const decimal = Number(project.tosPrice);
    const x = new Fraction(decimal);
    return [x.d, x.n];
  };
  return (
    <Flex flexDirection={'column'}>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}
        fontSize={'16px'}>
        <Text fontFamily={theme.fonts.fld}>LP Token</Text>
        <Button
          fontSize={'12px'}
          w={'152px'}
          h={'40px'}
          mt={'5px'}
          bg={'#257eee'}
          color={'#ffffff'}
          isDisabled={pool !== ZERO_ADDRESS && startTime > now}
          _disabled={{
            color: colorMode === 'light' ? '#86929d' : '#838383',
            bg: colorMode === 'light' ? '#e9edf1' : '#353535',
            cursor: 'not-allowed',
          }}
          _hover={
            pool !== ZERO_ADDRESS && startTime > now
              ? {}
              : {
                  background: 'transparent',
                  border: 'solid 1px #2a72e5',
                  color: themeDesign.tosFont[colorMode],
                  cursor: 'pointer',
                  width: '152px',
                  whiteSpace: 'normal',
                }
          }
          _focus={
            pool !== ZERO_ADDRESS && startTime > now
              ? {}
              : {
                  background: '#2a72e5',
                  border: 'solid 1px #2a72e5',
                  color: '#fff',
                  width: '152px',
                  whiteSpace: 'normal',
                }
          }
          _active={
            pool !== ZERO_ADDRESS && startTime > now
              ? {}
              : {
                  background: '#2a72e5',
                  border: 'solid 1px #2a72e5',
                  color: '#fff',
                  width: '152px',
                  whiteSpace: 'normal',
                }
          }
          whiteSpace={'normal'}
          onClick={() => createPool()}>
          Create Pool
        </Button>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text w={'29.2%'} fontFamily={theme.fonts.fld} color={'#7e8993'}>
          LP Token
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'35.4%'}
          color={'#7e8993'}
          textAlign={'center'}>
          Project Token
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'35.4%'}
          color={'#7e8993'}
          textAlign={'center'}>
          TOS
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text
          color={colorMode === 'light' ? '#7e8993' : ''}
          fontFamily={theme.fonts.fld}
          w={'29.2%'}>
          Amount in Initial Liquidity Vault
        </Text>
        <Text textAlign={'center'} w={'35.4%'} fontFamily={theme.fonts.fld}>
          {Number(projTokenBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Text textAlign={'center'} w={'35.4%'} fontFamily={theme.fonts.fld}>
          {Number(tosBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        h={'184px'}
        className={'chart-cell no-border-bottom'}>
        <Flex
          mt={'15px'}
          fontFamily={theme.fonts.fld}
          alignItems={'flex-start'}
          flexDir={'column'}
          h={'184px'}>
          <Text
            fontSize={'14px'}
            color={colorMode === 'light' ? '#353c48' : '#ffffff'}>
            Details
          </Text>
          <Flex mt={'6px'}>
            <Text
              fontSize={'13px'}
              color={colorMode === 'light' ? '#808992' : '#949494'}>
              Exchange Ratio :{' '}
            </Text>
            <Text
              fontSize={'13px'}
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              ml={'3px'}>
              {' '}
              1 TOS = {project.tosPrice} {project.tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </GridItem>
    </Flex>
  );
};

export const Condition3: React.FC<Condition3> = ({
  themeDesign,
  projTokenBalance,
  tosBalance,
  project,
  isAdmin,
  InitialLiquidityCompute,
  mint,
  createdPool,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();
  const bn = require('bignumber.js');
  useEffect(() => {
    getRatio();
  }, [account, project]);

  const encodePriceSqrt = (reserve1: number, reserve0: number) => {
    return new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toFixed();
  };

  const getRatio = () => {
    const decimal = Number(project.tosPrice);
    const x = new Fraction(decimal);
    return [x.d, x.n];
  };

  return (
    <Flex flexDirection={'column'}>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}
        fontSize={'16px'}>
        <Text fontFamily={theme.fonts.fld}>LP Token</Text>
        <Button
          fontSize={'12px'}
          w={'150px'}
          h={'32px'}
          mt={'5px'}
          bg={'#257eee'}
          color={'#ffffff'}
          isDisabled={createdPool === ZERO_ADDRESS}
          // isDisabled={true}
          _disabled={{
            color: colorMode === 'light' ? '#86929d' : '#838383',
            bg: colorMode === 'light' ? '#e9edf1' : '#353535',
            cursor: 'not-allowed',
          }}
          _hover={{
            background: 'transparent',
            border: 'solid 1px #2a72e5',
            color: colorMode === 'light' ? '#2a72e5' : '#2a72e5',
            cursor: 'pointer',

            whiteSpace: 'normal',
          }}
          _focus={{
            background: '#2a72e5',
            border: 'solid 1px #2a72e5',
            color: '#fff',

            whiteSpace: 'normal',
          }}
          _active={{
            background: '#2a72e5',
            border: 'solid 1px #2a72e5',
            color: '#fff',

            whiteSpace: 'normal',
          }}
          whiteSpace={'normal'}
          onClick={mint}>
          Mint Lp Token
        </Button>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text w={'29.2%'} fontFamily={theme.fonts.fld} color={'#7e8993'}>
          LP Token
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'35.4%'}
          color={'#7e8993'}
          textAlign={'center'}>
          Project Token
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'35.4%'}
          color={'#7e8993'}
          textAlign={'center'}>
          TOS
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text
          color={colorMode === 'light' ? '#7e8993' : ''}
          fontFamily={theme.fonts.fld}
          w={'29.2%'}>
          Amount in Initial Liquidity Vault
        </Text>
        <Text textAlign={'center'} w={'35.4%'} fontFamily={theme.fonts.fld}>
          {Number(projTokenBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Text textAlign={'center'} w={'35.4%'} fontFamily={theme.fonts.fld}>
          {Number(tosBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        h={'184px'}
        className={'chart-cell no-border-bottom'}>
        <Flex
          mt={'15px'}
          fontFamily={theme.fonts.fld}
          alignItems={'flex-start'}
          flexDir={'column'}
          h={'184px'}>
          <Text
            fontSize={'14px'}
            color={colorMode === 'light' ? '#353c48' : '#ffffff'}>
            Details
          </Text>
          <Flex mt={'6px'}>
            <Text
              fontSize={'13px'}
              color={colorMode === 'light' ? '#808992' : '#949494'}>
              Exchange Ratio :{' '}
            </Text>
            <Text
              fontSize={'13px'}
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              ml={'3px'}>
              {' '}
              1 TOS = {project.tosPrice}
              {project.tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </GridItem>
    </Flex>
  );
};

export const Condition4: React.FC<Condition4> = ({
  themeDesign,
  projTokenBalance,
  tosBalance,
  project,
  isAdmin,
  LPToken,
  mint,
  collect,
  npm,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const bn = require('bignumber.js');
  const [unclaimedTOS, setUnclaimedTOS] = useState<string>('0');
  const [unclaimedProjTok, setUnclaimedProjTok] = useState<string>('0');

  useEffect(() => {
    async function getTokenInfo() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
      if (LPToken !== 0) {
        const data = await npm.connect(signer).positions(LPToken);
        setUnclaimedTOS(ethers.utils.formatEther(data.tokensOwed0));
        setUnclaimedProjTok(ethers.utils.formatEther(data.tokensOwed1));
      }
    }

    getTokenInfo();
  }, [account, project, LPToken]);

  return (
    <Flex flexDirection={'column'}>
      <GridItem
        fontFamily={theme.fonts.fld}
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}
        fontSize={'16px'}>
        <Text fontFamily={theme.fonts.fld}>LP Token</Text>
        <Flex fontSize={'15px'}>
          <Text
            mr={'5px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            ID
          </Text>
          <Text color={'#257eee'}>#{LPToken}</Text>
        </Flex>
      </GridItem>
      <GridItem
        px={'0px'}
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        className={'chart-cell no-border-bottom'}>
        <Text
          w={'22.6%'}
          fontFamily={theme.fonts.fld}
          color={'#7e8993'}
          textAlign={'center'}>
          LP Token
        </Text>

        <Text
          fontFamily={theme.fonts.fld}
          w={'24.1%'}
          color={'#7e8993'}
          textAlign={'center'}>
          Project Token
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'24.1%'}
          color={'#7e8993'}
          textAlign={'center'}>
          TOS
        </Text>
        <Text
          fontFamily={theme.fonts.fld}
          w={'29.2%'}
          color={'#7e8993'}
          textAlign={'center'}>
          Action
        </Text>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        px={'0px'}
        className={'chart-cell no-border-bottom'}>
        <Flex justifyContent={'center'} w={'24.1%'}>
          <Text
            w={'47px'}
            color={colorMode === 'light' ? '#7e8993' : ''}
            fontFamily={theme.fonts.fld}>
            Increase Liquidity
          </Text>
        </Flex>

        <Text textAlign={'center'} w={'24.1%'} fontFamily={theme.fonts.fld}>
          {Number(projTokenBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Text textAlign={'center'} w={'24.1%'} fontFamily={theme.fonts.fld}>
          {Number(tosBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Flex justifyContent={'center'} alignContent={'center'} w={'29.2%'}>
          <Button
            fontSize={'12px'}
            w={'100px'}
            h={'32px'}
            bg={'#257eee'}
            color={'#ffffff'}
            // isDisabled={
            //   Number(tosBalance) === 0 ||
            //   Number(projTokenBalance) === 0
            // }
            isDisabled={true}
            _disabled={{
              color: colorMode === 'light' ? '#86929d' : '#838383',
              bg: colorMode === 'light' ? '#e9edf1' : '#353535',
              cursor: 'not-allowed',
            }}
            _hover={
              !isAdmin
                ? {}
                : {
                    background: 'transparent',
                    border: 'solid 1px #2a72e5',
                    color: colorMode === 'light' ? '#2a72e5' : '#2a72e5',
                    cursor: 'pointer',
                    whiteSpace: 'normal',
                  }
            }
            _focus={
              !isAdmin
                ? {}
                : {
                    background: '#2a72e5',
                    border: 'solid 1px #2a72e5',
                    color: '#fff',
                  }
            }
            _active={
              !isAdmin
                ? {}
                : {
                    background: '#2a72e5',
                    border: 'solid 1px #2a72e5',
                    color: '#fff',
                  }
            }
            onClick={mint}>
            Increase
          </Button>
        </Flex>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        borderBottom={'none'}
        px={'0px'}
        className={'chart-cell no-border-bottom'}>
        <Flex justifyContent={'center'} w={'24.1%'}>
          <Text
            w={'56px'}
            color={colorMode === 'light' ? '#7e8993' : ''}
            fontFamily={theme.fonts.fld}>
            Unclaimed fees
          </Text>
        </Flex>

        <Text textAlign={'center'} w={'24.1%'} fontFamily={theme.fonts.fld}>
          {Number(unclaimedProjTok).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Text textAlign={'center'} w={'24.1%'} fontFamily={theme.fonts.fld}>
          {Number(unclaimedTOS).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>
        <Flex justifyContent={'center'} alignContent={'center'} w={'29.2%'}>
          <Button
            fontSize={'12px'}
            w={'100px'}
            h={'32px'}
            bg={'#257eee'}
            color={'#ffffff'}
            isDisabled={
              !isAdmin ||
              Number(unclaimedProjTok) === 0 ||
              Number(unclaimedTOS) === 0
            }
            _disabled={{
              color: colorMode === 'light' ? '#86929d' : '#838383',
              bg: colorMode === 'light' ? '#e9edf1' : '#353535',
              cursor: 'not-allowed',
            }}
            _hover={
              !isAdmin
                ? {}
                : {
                    background: 'transparent',
                    border: 'solid 1px #2a72e5',
                    color: colorMode === 'light' ? '#2a72e5' : '#2a72e5',
                    cursor: 'pointer',
                    whiteSpace: 'normal',
                  }
            }
            _focus={
              !isAdmin
                ? {}
                : {
                    background: '#2a72e5',
                    border: 'solid 1px #2a72e5',
                    color: '#fff',
                  }
            }
            _active={
              !isAdmin
                ? {}
                : {
                    background: '#2a72e5',
                    border: 'solid 1px #2a72e5',
                    color: '#fff',
                  }
            }
            onClick={collect}>
            Collect
          </Button>
        </Flex>
      </GridItem>
      <GridItem
        border={themeDesign.border[colorMode]}
        h={'123px'}
        className={'chart-cell no-border-bottom'}>
        <Flex
          mt={'15px'}
          fontFamily={theme.fonts.fld}
          alignItems={'flex-start'}
          flexDir={'column'}
          h={'121px'}></Flex>
      </GridItem>
    </Flex>
  );
};
