import {
  Flex,
  Text,
  Center,
  Container,
  SimpleGrid,
  SkeletonCircle,
  Wrap,
  Image,
  Button,
} from '@chakra-ui/react';
import {useColorMode, useTheme} from '@chakra-ui/react';
import {motion, useAnimation} from 'framer-motion';
import {HTMLAttributes, useEffect, useState} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {useWindowDimensions} from 'hooks/useWindowDimentions';
import TONStaterLogo from 'assets/svgs/ts_bi_c.svg';
import Arrow from 'assets/svgs/select1_arrow_inactive.svg';
import Blue_Arrow from 'assets/svgs/blue_arrow.svg';

import {selectStakes} from 'pages/Staking/staking.reducer';
import {Stake} from 'pages/Staking/types';
import {useAppSelector} from 'hooks/useRedux';
import {DEPLOYED} from 'constants/index';
import {usePoolByUserQuery, usePoolByArrayQuery} from 'store/data/enhanced';
import ms from 'ms.macro';
import {fetchTosPriceURL, fetchEthPriceURL} from '../../constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import views from '../Reward/rewards';
import {selectTransactionType} from 'store/refetch.reducer';
// import {getLiquidity} from '../Reward/utils/getLiquidity';
import {fetchPoolPayload} from 'pages/Reward/utils/fetchPoolPayload';
import {NavLink} from 'react-router-dom';

export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

const elements = {
  marinLeft: 81,
  distanceMargin: 140,
  circleSize: '1',
  circleColor: '#ffffff',
  blueCircleColor: '#98c5f7',
  whiteWithOpacity: `rgba(255, 255, 255, 0.5)`,
  whiteWithoutOpacity: `rgba(255, 255, 255, 0.0)`,
  blueWithOpacity: `rgba(152, 197, 247, 0.5)`,
  blueWithoutOpacity: `rgba(152, 197, 247, 0.0)`,
};

const AddCircles = (props: any) => {
  const {animate, custom} = props;
  const {colorMode} = useColorMode();
  return (
    <>
      <motion.div custom={custom} initial={{opacity: 0}} animate={animate}>
        <SkeletonCircle
          size={elements.circleSize}
          pos={'absolute'}
          top="-2.5px"
          left="-2px"
          opacity={1}
          style={{
            WebkitAnimation: 'none',
            background:
              colorMode === 'light'
                ? `${elements.blueCircleColor}`
                : `${elements.circleColor}`,
          }}
        />
      </motion.div>
      <motion.div
        custom={custom + 0.5}
        initial={{opacity: 0}}
        animate={animate}>
        <SkeletonCircle
          size={elements.circleSize}
          pos={'absolute'}
          top="-2.5px"
          right="-2px"
          opacity={1}
          style={{
            WebkitAnimation: 'none',
            background:
              colorMode === 'light'
                ? `${elements.blueCircleColor}`
                : `${elements.circleColor}`,
          }}
        />
      </motion.div>
      <motion.div
        custom={custom + 1.5}
        initial={{opacity: 0}}
        animate={animate}>
        <SkeletonCircle
          size={elements.circleSize}
          pos={'absolute'}
          bottom="-2.5px"
          right="-2px"
          opacity={1}
          style={{
            WebkitAnimation: 'none',
            background:
              colorMode === 'light'
                ? `${elements.blueCircleColor}`
                : `${elements.circleColor}`,
          }}
        />
      </motion.div>
      <motion.div custom={custom + 2} initial={{opacity: 0}} animate={animate}>
        <SkeletonCircle
          size={elements.circleSize}
          pos={'absolute'}
          bottom="-2.5px"
          left="-2px"
          opacity={1}
          style={{
            WebkitAnimation: 'none',
            background:
              colorMode === 'light'
                ? `${elements.blueCircleColor}`
                : `${elements.circleColor}`,
          }}
        />
      </motion.div>
    </>
  );
};

const TextComponent = (props: any) => {
  const {header, content, circle, delay, ...rest} = props;
  const {colorMode} = useColorMode();

  return (
    <Center
      height="288px"
      flexDirection="column"
      alignItems="left"
      pl={25}
      pr={45}
      pos={'relative'}
      {...rest}>
      <Text
        fontSize="26px"
        fontWeight={'bold'}
        color={colorMode === 'light' ? '#353c48' : ''}>
        {header}
      </Text>
      <Text
        fontSize="15px"
        fontWeight={300}
        opacity={0.75}
        color={colorMode === 'light' ? '#808992' : ''}>
        {content}
      </Text>
    </Center>
  );
};

const SubTextComponent = (props: any) => {
  const {header, content, circle, delay, ...rest} = props;
  const {colorMode} = useColorMode();

  return (
    <Flex
      flexDirection="column"
      alignItems="left"
      pl={25}
      pr={45}
      pos={'relative'}
      {...rest}>
      <Text
        fontSize="15px"
        fontWeight={'bold'}
        color={colorMode === 'light' ? '#808992' : ''}
        h={'19px'}>
        {header}
      </Text>
      <Text
        fontSize="24px"
        fontWeight={300}
        opacity={0.75}
        color={colorMode === 'light' ? '#353c48' : ''}
        h={'30px'}>
        {content}
      </Text>
    </Flex>
  );
};

const makeCircle = (left: number, top: number, colorMode: 'light' | 'dark') => {
  return (
    <SkeletonCircle
      size={elements.circleSize}
      pos={'absolute'}
      top={top}
      left={left === 0 ? 77 : 77 + left * 140}
      opacity={1}
      style={{
        WebkitAnimation: 'none',
        background: colorMode === 'light' ? '#98c5f7' : `#ffffff`,
      }}
    />
  );
};

const makeDots = (width: number, height: number) => {
  const result = [];
  const leftMargin = 81;
  const distantMargin = 140;

  const horizonalDotNumbers = (width - leftMargin) / distantMargin;

  for (let i = 0; i < horizonalDotNumbers; i++) {
    result.push(i);
  }

  return result;
};

const getCondition = (rIndex: number, cIndex: number) => {
  const firstRowIndex = 0;
  const lastRowIndex = 6;
  const checkOddNum = (rIndex + 1) % 2 !== 0 ? true : false;
  const checkFirstRow = cIndex === firstRowIndex ? true : false;
  const checkLaswRow = cIndex === lastRowIndex ? true : false;

  if (checkOddNum && checkFirstRow) {
    return true;
  }
  if (checkOddNum && checkLaswRow) {
    return true;
  }
  return false;
};

const getLeftArea = (rowDots: number[]) => {
  const leftMargin = elements.marinLeft;
  const distantMargin = elements.distanceMargin;
  const middlePoint =
    rowDots.length % 2 !== 0
      ? Math.round(rowDots.length / 2) - 1
      : Math.round(rowDots.length / 2);
  const finalMiddlePoint =
    middlePoint % 2 === 0 ? middlePoint : middlePoint - 1;
  return leftMargin + finalMiddlePoint * distantMargin;
};

export const Animation: React.FC<HomeProps> = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {width} = useWindowDimensions();
  const [rowDots, setRowDots] = useState<number[]>([]);
  const [timer] = useState({
    firstLine: 0,
    scondLine: 0.5,
    circles: 1,
    innerLine: 1.3,
    mainText: 4,
    subText: 5,
    lastPhase: 6,
    lastCircle: 7,
  });

  const {account, library} = useActiveWeb3React();
  const [poolAddresses, setPoolAddresses] = useState<string[]>([]);
  const [poolsFromAPI, setPoolsFromAPI] = useState<any>([]);
  const [pool, setPool] = useState<any[]>([]);

  // useEffect(() => {
  //   async function getPrice() {
  //     const tosPrices = await fetch(fetchTosPriceURL)
  //       .then((res) => res.json())
  //       .then((result) => result);

  //     const ethPrices = await fetch(fetchEthPriceURL)
  //       .then((res) => res.json())
  //       .then((result) => result);

  //     setEthPrice(ethPrices[0].current_price)
  //     setTosPrice(tosPrices);
  //   }
  //   getPrice();
  // }, []);

  const verticalDots: number[] = [77, 221, 365, 509, 653, 797, 941];

  const bgColor = colorMode === 'light' ? '#fafbfc' : 'black.200';

  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const mainControls = useAnimation();
  const mainSubControls = useAnimation();
  const secondPhaseControls = useAnimation();
  const secondSubPhaseControls = useAnimation();
  const lastPhase = useAnimation();
  const circleControls = useAnimation();
  const lastCircleControls = useAnimation();

  useEffect(() => {
    const aniMultiplier = 15;
    const result = makeDots(Number(width), 1024);
    const delay = result.length / aniMultiplier;
    setRowDots(result);

    mainControls.start((i) => ({
      borderLeftWidth: [null, '1px', '1px'],
      borderRightWidth: [null, '1px', '1px'],
      borderLeftColor: [
        null,
        colorMode === 'light'
          ? `${elements.blueWithOpacity}`
          : `${elements.whiteWithOpacity}`,
        colorMode === 'light'
          ? `${elements.blueWithOpacity}`
          : `${elements.whiteWithOpacity}`,
      ],
      borderRightColor: [
        null,
        colorMode === 'light'
          ? `${elements.blueWithoutOpacity}`
          : `${elements.whiteWithoutOpacity}`,
        colorMode === 'light'
          ? `${elements.blueWithOpacity}`
          : `${elements.whiteWithOpacity}`,
      ],

      transition: {
        delay: delay + i,
        duration: 2,
        times: [0, 0.5, 1],
      },
    }));

    mainSubControls.start((i) => ({
      borderRightWidth: '1px',
      borderRightColor:
        colorMode === 'light'
          ? `${elements.blueWithOpacity}`
          : `${elements.whiteWithOpacity}`,
      opacity: 1,
      transition: {
        delay: delay + i + 0.5,
        duration: 2,
      },
    }));

    secondPhaseControls.start((i) => ({
      borderTopColor: [
        colorMode === 'light'
          ? elements.blueWithoutOpacity
          : elements.whiteWithoutOpacity,
        colorMode === 'light'
          ? elements.blueWithOpacity
          : elements.whiteWithOpacity,
        colorMode === 'light'
          ? elements.blueWithOpacity
          : elements.whiteWithOpacity,
      ],
      borderBottomColor: [
        colorMode === 'light'
          ? elements.blueWithoutOpacity
          : elements.whiteWithoutOpacity,
        colorMode === 'light'
          ? elements.blueWithoutOpacity
          : elements.whiteWithoutOpacity,
        colorMode === 'light'
          ? elements.blueWithOpacity
          : elements.whiteWithOpacity,
      ],
      opacity: 1,
      transition: {
        delay: delay + i,
        duration: 3,
        times: [0, 0.5, 1],
      },
    }));

    secondSubPhaseControls.start((i) => ({
      opacity: 1,
      transition: {
        delay: delay + i,
      },
    }));

    lastPhase.start((i) => ({
      opacity: 1,
      transition: {
        delay: delay + i,
      },
    }));

    circleControls.start((i) => ({
      opacity: 1,
      transition: {
        delay: delay + i,
      },
    }));

    lastCircleControls.start((i) => ({
      opacity: 1,
      transition: {
        delay: delay + i,
      },
    }));
  }, [
    width,
    mainControls,
    mainSubControls,
    secondPhaseControls,
    secondSubPhaseControls,
    lastPhase,
    circleControls,
    lastCircleControls,
  ]);

  const [totalStakedAmount, setTotalStakedAmount] = useState('');
  const [liquidity, setLiquidity] = useState('');

  const {data} = useAppSelector(selectStakes);

  useEffect(() => {
    async function fetchProjectsData() {
      const poolsData: any = await views.getPoolData(library);
      setPoolsFromAPI(poolsData);
      const poolArray: any = [];
      if (poolsData) {
        poolsData.map((pool: any) => {
          poolArray.push(pool.poolAddress);
        });
      }
      setPoolAddresses(poolArray);
    }
    fetchProjectsData();
  }, [account, library]);

  //GET Phase 2 Liquidity Info
  // const {BasePool_Addres, DOCPool_Address} = DEPLOYED;
  // const {BasePool_Address} = DEPLOYED;
  // const basePool = usePoolByUserQuery(
  //   {address: BasePool_Address?.toLowerCase()},
  //   {
  //     pollingInterval: ms`2m`,
  //   },
  // );
  const poolArr = usePoolByArrayQuery(
    {address: poolAddresses},
    {
      pollingInterval: ms`2s`,
    },
  );

  useEffect(() => {
    const addPoolsInfo = () => {
      const pols = poolArr.data?.pools;
      if (pols !== undefined) {
        const pools = pols.map((data: any) => {
          const APIPool = poolsFromAPI.find(
            (pol: any) => pol.poolAddress === data.id,
          );
          const token0Image = APIPool.token0Image;
          const token1Image = APIPool.token1Image;
          return {
            ...data,
            token0Image: token0Image,
            token1Image: token1Image,
          };
        });
        setPool(pools);
      }
    };
    addPoolsInfo();
  }, [account, transactionType, blockNumber, poolArr]);

  useEffect(() => {
    async function calcLiquidity() {
      let totalLiquidity = 0;
      const tvl = await fetchPoolPayload(library);
      for (const liquidity of tvl) {
        totalLiquidity = totalLiquidity + Number(liquidity.total);
      }
      const res = Number(totalLiquidity).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      setLiquidity(
        res.split('.')[0] + '.' + res.split('.')[1][0] + res.split('.')[1][1],
      );
    }
    calcLiquidity();
  }, [library, pool]);

  useEffect(() => {
    if (data) {
      let total = 0;
      data.map((e: Stake) => {
        return (total += Number(e.stakeBalanceTON));
      });
      return setTotalStakedAmount(
        Number(total).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
      );
    }
  }, [data]);

  return (
    <Flex
      maxW="100%"
      mt={'-78px'}
      height={1102}
      bg={bgColor}
      position="relative"
      borderBottomWidth="1px"
      borderBottomColor={
        colorMode === 'light'
          ? `${elements.blueWithOpacity}`
          : `${elements.whiteWithOpacity}`
      }
      fontFamily={theme.fonts.fld}>
      <motion.div
        custom={timer.lastCircle}
        initial={{opacity: 0}}
        animate={lastCircleControls}>
        <Flex
          pos="absolute"
          left={getLeftArea(rowDots) - 30}
          top={verticalDots[verticalDots.length - 1] - 26}
          borderWidth="1px"
          w="56px"
          h="56px"
          alignItems="center"
          justifyContent="center"
          borderRadius={25}
          borderColor={
            colorMode === 'light'
              ? elements.blueWithOpacity
              : elements.whiteWithOpacity
          }
          bg={bgColor}
          zIndex={100}>
          <Flex
            borderWidth="1px"
            w="30px"
            h="30px"
            borderRadius={25}
            borderColor={
              colorMode === 'light'
                ? elements.blueWithOpacity
                : elements.whiteWithOpacity
            }
            alignItems="center"
            justifyContent="center">
            <Image
              width="9px"
              height="8px"
              src={colorMode === 'light' ? Blue_Arrow : Arrow}></Image>
          </Flex>
        </Flex>
      </motion.div>
      <motion.div
        style={{position: 'absolute', left: '45%', top: '50%'}}
        initial={{
          opacity: 1,
        }}
        animate={{opacity: 0}}
        transition={{duration: 1}}>
        <Center>
          <Image src={TONStaterLogo}></Image>
        </Center>
      </motion.div>
      {rowDots.map((r, rIndex) =>
        verticalDots.map((c, cIndex) => {
          return (
            <motion.div
              style={{position: 'relative'}}
              initial={{opacity: 1}}
              animate={{opacity: getCondition(rIndex, cIndex) === true ? 1 : 0}}
              transition={{delay: (rIndex + cIndex) / 20}}>
              {makeCircle(rIndex, c, colorMode)}
            </motion.div>
          );
        }),
      )}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
        initial={{opacity: 1}}>
        <motion.div
          style={{
            position: 'relative',
            height: '100%',
          }}
          custom={timer.mainText}
          initial={{opacity: 0}}
          animate={secondSubPhaseControls}>
          <Container
            m={0}
            p={0}
            h={'100%'}
            pos="relative"
            w={getLeftArea(rowDots)}
            d="flex"
            flexDirection="column"
            justifyContent="center"
            pl={'80px'}
            color={colorMode === 'light' ? '#353c48' : 'white.100'}
            fontWeight="semibold"
            fontSize={46}>
            <div style={{position: 'absolute', bottom: '561px'}}>
              <Text>TONStarter</Text>
              <Text>Decentralized Launchpad</Text>
              <Text>Platform</Text>
            </div>
            <div style={{position: 'absolute', bottom: '302px'}}>
              <Text
                fontSize={'26px'}
                color={colorMode === 'light' ? '#0070ed' : '#ffff07'}
                h={'25px'}>
                Phase 1 Total Staked
              </Text>
              <Text fontSize={'52px'} h={'60px'}>
                {totalStakedAmount} <span style={{fontSize: '26px'}}>TON</span>
              </Text>
            </div>
            <div style={{position: 'absolute', bottom: '193px'}}>
              <Text
                fontSize={'26px'}
                color={colorMode === 'light' ? '#0070ed' : '#ffff07'}
                h={'25px'}>
                Total Ecosystem Value Locked
              </Text>
              <Text fontSize={'52px'} h={'60px'}>
                <span style={{fontSize: '35px'}}>$</span> {liquidity}
              </Text>
            </div>
          </Container>
        </motion.div>
        <motion.div
          initial={{
            borderColor: `${elements.whiteWithoutOpacity}`,
          }}
          custom={timer.firstLine}
          animate={mainControls}
          style={{display: 'flex', height: '100%', marginLeft: '-2.5px'}}>
          <SimpleGrid
            d="flex"
            flexDirection="column"
            justifyContent="center"
            w={elements.distanceMargin * 2 - 1}
            color="white.100"
            display="flex"
            alignItems="center"
            // borderX="1px solid rgba(255, 255, 255, 0.25)"
          >
            <motion.div
              custom={timer.subText}
              initial={{opacity: 0}}
              animate={secondSubPhaseControls}>
              <TextComponent
                header={'Dual Profit'}
                content={
                  'generated from the platform growth and individual projects'
                }
              />
            </motion.div>
            <motion.div
              initial={{
                borderTopWidth: '1px',
                borderBottomWidth: '1px',
                borderColor:
                  colorMode === 'light'
                    ? `${elements.blueWithoutOpacity}`
                    : `${elements.whiteWithoutOpacity}`,
              }}
              custom={timer.innerLine}
              animate={secondPhaseControls}
              style={{position: 'relative'}}>
              <AddCircles animate={circleControls} custom={timer.circles} />
              <motion.div
                custom={timer.subText + 0.4}
                initial={{opacity: 0}}
                animate={secondSubPhaseControls}>
                <TextComponent
                  header={'Permissionless'}
                  content={'Fair Opportunity to participation and rewards'}
                  // borderY="1px solid rgba(255, 255, 255, 0.25)"
                  borderRadius="10px dotted black"
                  circle="all"
                  delay={rowDots.length / 2}></TextComponent>
              </motion.div>
            </motion.div>
            <motion.div
              custom={timer.subText + 0.8}
              initial={{opacity: 0}}
              animate={secondSubPhaseControls}>
              <TextComponent
                header={'Transparent'}
                content={
                  'TOS holders can participate in all platform decisions by staking TOS into sTOS(staked TOS)'
                }
              />
            </motion.div>
          </SimpleGrid>
        </motion.div>

        <motion.div
          custom={timer.scondLine}
          initial={{opacity: 0}}
          animate={mainSubControls}
          style={{display: 'flex', height: '100%', paddingTop: '77.5px'}}>
          <motion.div
            custom={timer.lastPhase}
            initial={{opacity: 0}}
            animate={lastPhase}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Scrollbars
              style={{
                width: '279px',
                display: 'flex',
                position: 'relative',
              }}
              thumbSize={70}
              renderThumbVertical={() => (
                <div
                  style={{
                    background: '#ffffff',
                    position: 'relative',
                    right: '-2px',
                  }}></div>
              )}
              renderThumbHorizontal={() => (
                <div style={{background: 'black'}}></div>
              )}>
              <Flex color="white.100" pt="140px" flexDir={'column'}>
                <Flex mb={'70px'} flexDir={'column'} pl={25}>
                  <Text
                    color={colorMode === 'light' ? '#0070ed' : ''}
                    fontSize="26px"
                    fontWeight={'bold'}
                    mb={'5px'}>
                    New Feature
                  </Text>
                  <Text
                    fontSize="15px"
                    fontWeight={'bold'}
                    color={colorMode === 'light' ? '#808992' : ''}
                    mb={'30px'}>
                    Make Your Own Token and <br /> Create Token Economy
                  </Text>
                  <NavLink to="/launch">
                    <Button
                      w={'140px'}
                      h={'35px'}
                      bg={'#007aff'}
                      fontSize={13}
                      _hover={{}}>
                      Launched Project
                    </Button>
                  </NavLink>
                </Flex>
                <SubTextComponent
                  header={'Raised Capital'}
                  content={'$ 7,115,401.98'}
                  mb={'30px'}
                />
                <SubTextComponent
                  header={'TOS pairs (in Uniswap)'}
                  content={'6'}
                />
              </Flex>
            </Scrollbars>
          </motion.div>
        </motion.div>
      </motion.div>
    </Flex>
  );
};
