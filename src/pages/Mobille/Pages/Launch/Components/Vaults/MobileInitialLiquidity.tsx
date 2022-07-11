//MobileInitialLiquidity

import {FC, useState, useEffect, Dispatch, SetStateAction} from 'react';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  Button,
  useTheme,
  Grid,
  GridItem,
  Link,
} from '@chakra-ui/react';
import {shortenAddress} from 'utils';
import momentTZ from 'moment-timezone';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import moment from 'moment';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {BASE_PROVIDER} from 'constants/index';
import InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as UniswapV3FactoryABI from 'services/abis/UniswapV3Factory.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {ethers} from 'ethers';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import Fraction from 'fraction.js';
import {addPool} from 'pages/Admin/actions/actions';

const {TOS_ADDRESS, UniswapV3Factory, NPM_Address} = DEPLOYED;

type InitialLiquidity = {
  vault: any;
  project: any;
};

type TokenCompProps = {
  vault: any;
  project: any;
  createdPool: string;
};

type LPComp4Props = {
  vault: any;
  project: any;
  LPToken: Number;
  projTokenBalance: string;
  tosBalance: string;
  mint: Dispatch<SetStateAction<any>>;
  collect: Dispatch<SetStateAction<any>>;
  isAdmin: boolean;
  npm: any;
};

type LPComp1Props = {
  vault: any;
  project: any;
  LPToken: Number;
  projTokenBalance: string;
  tosBalance: string;
};

type LPComp2Props = {
  project: any;
  projTokenBalance: string;
  tosBalance: string;
  isAdmin: boolean;
  InitialLiquidityCompute: any;
};

type LPComp3Props = {
  project: any;
  projTokenBalance: string;
  tosBalance: string;
  isAdmin: boolean;
  InitialLiquidityCompute: any;
  mint: Dispatch<SetStateAction<any>>;
};
export const MobileInitialLiquidity: FC<InitialLiquidity> = ({
  vault,
  project,
}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [buttonState, setButtonState] = useState('Token');
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const {account, library, chainId} = useActiveWeb3React();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [tosBalance, setTosBalance] = useState<string>('');
  const [projTokenBalance, setProjTokenBalance] = useState<string>('');
  const [isPool, setIsPool] = useState<boolean>(false);
  const [isLpToken, setIsLpToken] = useState<boolean>(false);
  const [LPToken, setLPToken] = useState<Number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [createdPool, setCreatedPool] = useState<string>('');
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
      setIsPool(getPool === ZERO_ADDRESS ? false : true);
      setCreatedPool(getPool === ZERO_ADDRESS ? '' : getPool);
      // setIsPool(false)
      setIsLpToken(Number(LP) === 0 ? false : true);
      // console.log(Number(LP));
      setLPToken(Number(LP));
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber, vault]);

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

  const mint = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    try {
      const receipt = await InitialLiquidityCompute.connect(signer).mint();
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
          fontWeight={buttonState === 'LP' ? 'bold' : 'normal'}
          color={
            buttonState === 'LP'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('LP')}>
          LP Token
        </Text>
      </Flex>
      {buttonState === 'Token' ? (
        <TokenComp vault={vault} project={project} createdPool={createdPool} />
      ) : Number(tosBalance) === 0 ? (
        isPool && isLpToken ? (
          <LPCompCond4
            vault={vault}
            project={project}
            LPToken={LPToken}
            tosBalance={tosBalance}
            projTokenBalance={projTokenBalance}
            mint={mint}
            isAdmin={isAdmin}
            npm={NPM}
            collect={collect}
          />
        ) : (
          <LPCompCond1
            vault={vault}
            project={project}
            LPToken={LPToken}
            tosBalance={tosBalance}
            projTokenBalance={projTokenBalance}
          />
        )
      ) : isPool ? (
        isLpToken ? (
          <LPCompCond4
            vault={vault}
            project={project}
            LPToken={LPToken}
            tosBalance={tosBalance}
            projTokenBalance={projTokenBalance}
            mint={mint}
            isAdmin={isAdmin}
            npm={NPM}
            collect={collect}
          />
        ) : (
          <LPCompCond3
            project={project}
            tosBalance={tosBalance}
            projTokenBalance={projTokenBalance}
            isAdmin={isAdmin}
            InitialLiquidityCompute={InitialLiquidityCompute}
            mint={mint}
          />
        )
      ) : (
        <LPCompCond2
          project={project}
          tosBalance={tosBalance}
          projTokenBalance={projTokenBalance}
          isAdmin={isAdmin}
          InitialLiquidityCompute={InitialLiquidityCompute}
        />
      )}
      <Flex w="100%" justifyContent={'center'} mt="40px">
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="15px"
          color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
          textAlign={'center'}
          w="178px"
          wordBreak={'break-word'}>
          All tokens are used initially. There is no claim schedule
        </Text>
      </Flex>
    </Flex>
  );
};
const LPCompCond1: React.FC<LPComp1Props> = ({
  vault,
  project,
  LPToken,
  projTokenBalance,
  tosBalance,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const network = BASE_PROVIDER._network.name;
  const [unclaimedTOS, setUnclaimedTOS] = useState<string>('0');
  const [unclaimedProjTok, setUnclaimedProjTok] = useState<string>('0');

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
        h={'60px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          LP Token
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        h={'60px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text
          fontFamily={theme.fonts.robto}
          fontSize="14px"
          color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
          Please send TOS from Public sale Vault to Initial Liquidity vault.
        </Text>
      </GridItem>
      <GridItem style={gridItemStyle} h={'118px'}>
        <Flex flexDir={'column'}>
          <Text style={leftText}>Amount in Initial Liquidity Vault</Text>
          <Text mt={'15px'} style={rightText}>
            {' '}
            {Number(projTokenBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
            {project.tokenSymbol}
          </Text>
          <Text style={rightText}>
            {' '}
            {Number(tosBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{' '}
            {'TOS'}
          </Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

const LPCompCond2: React.FC<LPComp2Props> = ({
  projTokenBalance,
  tosBalance,
  project,
  isAdmin,
  InitialLiquidityCompute,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library, chainId} = useActiveWeb3React();
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
  const bn = require('bignumber.js');
  useEffect(() => {
    getRatio();
  }, [account, project]);

  const getRatio = () => {
    const decimal = Number(project.tosPrice);
    const x = new Fraction(decimal);
    return [x.d, x.n];
  };

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
      ).setInitialPriceAndCreatePool(
        getRatio()[0],
        getRatio()[1],
        encodePriceSqrt(getRatio()[0], getRatio()[1]),
      );
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
        h={'60px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          LP Token
        </Text>
        <Button
          fontSize={'12px'}
          w={'140px'}
          h={'40px'}
          mt={'5px'}
          bg={'#257eee'}
          color={'#ffffff'}
          px={'7px'}
          fontWeight={'normal'}
          isDisabled={!isAdmin}
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
                  color: themeDesign.tosFont[colorMode],
                  cursor: 'pointer',
                  width: '152px',
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
                  width: '152px',
                  whiteSpace: 'normal',
                }
          }
          _active={
            !isAdmin
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
          Approve to Create Pool & Set Initial Price
        </Button>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        h={'114px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex flexDir={'column'}>
          <Text style={leftText}>Amount in Initial Liquidity Vault</Text>
          <Text mt={'15px'} style={rightText}>
            {' '}
            {Number(projTokenBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
            {project.tokenSymbol}
          </Text>
          <Text style={rightText}>
            {' '}
            {Number(tosBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{' '}
            {'TOS'}
          </Text>
        </Flex>
      </GridItem>
      <GridItem style={gridItemStyle} h={'104px'}>
        <Flex flexDir={'column'}>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize="14px"
            color={colorMode === 'light' ? '#353c48' : '#fff'}
            fontWeight={600}>
            Details
          </Text>
          <Flex>
            <Text
              fontFamily={theme.fonts.fld}
              fontSize="13px"
              color={colorMode === 'light' ? '#808992' : '#949494'}>
              Exchange Ratio :
            </Text>
            <Text
              ml={'2.5px'}
              fontFamily={theme.fonts.fld}
              fontSize="13px"
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}>
              1 TOS = {project.tosPrice} {project.tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};

const LPCompCond3: React.FC<LPComp3Props> = ({
  projTokenBalance,
  tosBalance,
  project,
  isAdmin,
  InitialLiquidityCompute,
  mint,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
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
        h={'60px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          LP Token
        </Text>
        <Button
          fontSize={'12px'}
          w={'100px'}
          h={'32px'}
          px={0}
          mt={'5px'}
          fontWeight={500}
          bg={'#257eee'}
          color={'#ffffff'}
          // isDisabled={createdPool === ZERO_ADDRESS}
          _disabled={{
            color: colorMode === 'light' ? '#86929d' : '#838383',
            bg: colorMode === 'light' ? '#e9edf1' : '#353535',
            cursor: 'not-allowed',
          }}
          _hover={{}}
          _focus={{}}
          _active={{}}
          whiteSpace={'normal'}
          onClick={mint}>
          Mint Lp Token
        </Button>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        h={'114px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex flexDir={'column'}>
          <Text style={leftText}>Amount in Initial Liquidity Vault</Text>
          <Text mt={'15px'} style={rightText}>
            {' '}
            {Number(projTokenBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
            {project.tokenSymbol}
          </Text>
          <Text style={rightText}>
            {' '}
            {Number(tosBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{' '}
            {'TOS'}
          </Text>
        </Flex>
      </GridItem>
      <GridItem style={gridItemStyle} h={'104px'}>
        <Flex flexDir={'column'}>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize="14px"
            color={colorMode === 'light' ? '#353c48' : '#fff'}
            fontWeight={600}>
            Details
          </Text>
          <Flex>
            <Text
              fontFamily={theme.fonts.fld}
              fontSize="13px"
              color={colorMode === 'light' ? '#808992' : '#949494'}>
              Exchange Ratio :
            </Text>
            <Text
              ml={'2.5px'}
              fontFamily={theme.fonts.fld}
              fontSize="13px"
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}>
              1 TOS = {project.tosPrice} {project.tokenSymbol}
            </Text>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};
const LPCompCond4: React.FC<LPComp4Props> = ({
  vault,
  project,
  LPToken,
  projTokenBalance,
  tosBalance,
  mint,
  collect,
  isAdmin,
  npm,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const network = BASE_PROVIDER._network.name;
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
        h={'60px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          LP Token
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        h={'60px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText}>ID</Text>
        <Text color={'#257eee'} fontFamily={theme.fonts.fld} fontSize="14px">
          #{LPToken}
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        h={'114px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex flexDir={'column'}>
          <Text style={leftText}>Increase Liquidity</Text>
          <Text style={rightText} mt={'15px'}>
            {' '}
            {Number(projTokenBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{' '}
            {project.tokenSymbol}
          </Text>
          <Text style={rightText} mt={'5px'}>
            {' '}
            {Number(tosBalance).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{' '}
            {'TOS'}
          </Text>
        </Flex>
        <Button
          fontSize={'13px'}
          w={'100px'}
          h={'32px'}
          bg={'#257eee'}
          color={'#ffffff'}
          isDisabled={
            Number(tosBalance) === 0 || Number(projTokenBalance) === 0
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
                  color: themeDesign.tosFont[colorMode],
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
      </GridItem>
      <GridItem
        style={gridItemStyle}
        h={'114px'}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Flex flexDir={'column'}>
          <Text style={leftText}>Unclaimed Fees</Text>
          <Text style={rightText} mt={'15px'}>
            {Number(unclaimedProjTok).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{' '}
            {project.tokenSymbol}
          </Text>
          <Text style={rightText} mt={'5px'}>
            {Number(unclaimedTOS).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{' '}
            {'TOS'}
          </Text>
        </Flex>
        <Button
          fontSize={'13px'}
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
                  color: themeDesign.tosFont[colorMode],
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
      </GridItem>
    </Grid>
  );
};

const TokenComp: React.FC<TokenCompProps> = ({vault, project, createdPool}) => {
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
        <Text style={leftText}>Price Range</Text>

        <Text style={rightText}>Full Range</Text>
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
            createdPool !== ''
              ? `https://info.uniswap.org/#/pools/${createdPool.toLowerCase()}`
              : ''
          }
          _hover={{color: '#2a72e5'}}
          style={rightText}
          textDecor="underline">
          {createdPool !== '' ? shortenAddress(createdPool) : 'NA'}
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
