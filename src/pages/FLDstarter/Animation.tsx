import {
  Flex,
  Text,
  Center,
  Container,
  SimpleGrid,
  SkeletonCircle,
  Wrap,
  Image,
} from '@chakra-ui/react';
import {useColorMode, useTheme} from '@chakra-ui/react';
import {motion, useAnimation} from 'framer-motion';
import {HTMLAttributes, useEffect, useState} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {useWindowDimensions} from 'hooks/useWindowDimentions';
import TONStaterLogo from 'assets/svgs/ts_bi_c.svg';
import Arrow from 'assets/svgs/select1_arrow_inactive.svg';
import {selectStakes} from 'pages/Staking/staking.reducer';
import {Stake} from 'pages/Staking/types';
import {useAppSelector} from 'hooks/useRedux';
import {DEPLOYED} from 'constants/index';
import {usePoolByUserQuery, usePositionByPoolQuery} from 'store/data/enhanced';
import ms from 'ms.macro';

export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

const elements = {
  marinLeft: 81,
  distanceMargin: 140,
  circleSize: '1',
  circleColor: '#ffffff',
  whiteWithOpacity: `rgba(255, 255, 255, 0.5)`,
  whiteWithoutOpacity: `rgba(255, 255, 255, 0.0)`,
};

const addCircles = (props: any) => {
  const {animate, custom} = props;
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
            background: `${elements.circleColor}`,
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
            background: `${elements.circleColor}`,
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
            background: `${elements.circleColor}`,
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
            background: `${elements.circleColor}`,
          }}
        />
      </motion.div>
    </>
  );
};

const TextComponent = (props: any) => {
  const {header, content, circle, delay, ...rest} = props;

  return (
    <Center
      height="288px"
      flexDirection="column"
      alignItems="left"
      pl={25}
      pr={45}
      pos={'relative'}
      {...rest}>
      <Text fontSize="26px" fontWeight={'bold'}>
        {header}
      </Text>
      <Text fontSize="15px" fontWeight={300} opacity={0.75}>
        {content}
      </Text>
    </Center>
  );
};

const makeCircle = (left: number, top: number) => {
  return (
    <SkeletonCircle
      size={elements.circleSize}
      pos={'absolute'}
      top={top}
      left={left === 0 ? 77 : 77 + left * 140}
      opacity={1}
      style={{
        WebkitAnimation: 'none',
        background: `#ffffff`,
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
  const verticalDots: number[] = [77, 221, 365, 509, 653, 797, 941];

  const bgColor = colorMode === 'light' ? 'blue.200' : 'black.200';

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
        `${elements.whiteWithOpacity}`,
        `${elements.whiteWithOpacity}`,
      ],
      borderRightColor: [
        null,
        `${elements.whiteWithoutOpacity}`,
        `${elements.whiteWithOpacity}`,
      ],

      transition: {
        delay: delay + i,
        duration: 2,
        times: [0, 0.5, 1],
      },
    }));

    mainSubControls.start((i) => ({
      borderRightWidth: '1px',
      borderRightColor: `${elements.whiteWithOpacity}`,
      opacity: 1,
      transition: {
        delay: delay + i + 0.5,
        duration: 2,
      },
    }));

    secondPhaseControls.start((i) => ({
      borderTopColor: [
        elements.whiteWithoutOpacity,
        elements.whiteWithOpacity,
        elements.whiteWithOpacity,
      ],
      borderBottomColor: [
        elements.whiteWithoutOpacity,
        elements.whiteWithoutOpacity,
        elements.whiteWithOpacity,
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

  //GET Phase 2 Liquidity Info
  // const {BasePool_Addres, DOCPool_Address} = DEPLOYED;
  const {
    UniswapStaking_Address,
    DOCPool_Address,
    BasePool_Address,
    UniswapStaker_Address,
  } = DEPLOYED;
  const basePool = usePoolByUserQuery(
    {address: BasePool_Address?.toLowerCase()},
    {
      pollingInterval: ms`2m`,
    },
  );

  useEffect(() => {
    if (basePool?.data?.pools) {
      const {
        data: {pools},
      } = basePool;
      //GET WTON-PAIR WITH KEY 0
      const WTON_TOS_PAIR = pools[0];
      if (!WTON_TOS_PAIR) {
        setLiquidity('0');
        return;
      }
      const {poolDayData} = WTON_TOS_PAIR;
      const lastestLiquidity = poolDayData[poolDayData.length - 1].tvlUSD;
      const res = Number(lastestLiquidity).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      setLiquidity(
        res.split('.')[0] + '.' + res.split('.')[1][0] + res.split('.')[1][1],
      );
    }
  }, [basePool]);

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
      height={1024}
      bg={bgColor}
      position="relative"
      borderBottomWidth="1px"
      borderBottomColor={`${elements.whiteWithOpacity}`}
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
          borderColor={elements.whiteWithOpacity}
          bg={bgColor}
          zIndex={100}>
          <Flex
            borderWidth="1px"
            w="30px"
            h="30px"
            borderRadius={25}
            borderColor={elements.whiteWithOpacity}
            alignItems="center"
            justifyContent="center">
            <Image width="9px" height="8px" src={Arrow}></Image>
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
              {makeCircle(rIndex, c)}
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
            color="white.100"
            fontWeight="semibold"
            fontSize={46}>
            <div style={{position: 'absolute', bottom: '561px'}}>
              <Text>TON Starter</Text>
              <Text>Decentralized Launchpad</Text>
              <Text>Platform</Text>
            </div>
            <div style={{position: 'absolute', bottom: '302px'}}>
              <Text fontSize={'26px'} color={'#ffff07'} h={'25px'}>
                Phase 1 Total Staked
              </Text>
              <Text fontSize={'52px'} h={'60px'}>
                {totalStakedAmount} <span style={{fontSize: '26px'}}>TON</span>
              </Text>
            </div>
            <div style={{position: 'absolute', bottom: '193px'}}>
              <Text fontSize={'26px'} color={'#ffff07'} h={'25px'}>
                Phase 2 Total WTON-TOS liquidity
              </Text>
              <Text fontSize={'52px'} h={'60px'}>
                {liquidity} <span style={{fontSize: '26px'}}>$</span>
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
                borderColor: `${elements.whiteWithoutOpacity}`,
              }}
              custom={timer.innerLine}
              animate={secondPhaseControls}
              style={{position: 'relative'}}>
              {addCircles({animate: circleControls, custom: timer.circles})}
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
              <Wrap display="flex" h="100%" color="white.100" pt="640px">
                <Text pl={25} fontSize="26px" fontWeight={'bold'}>
                  ROAD MAP
                </Text>
                <TextComponent
                  header={'Phase 1'}
                  content={'TOS Liquidity Mining Launch'}
                />
                <TextComponent
                  header={'Phase 2'}
                  content={'TOS staking, LP staking'}
                />
                <TextComponent
                  header={'Phase 3'}
                  content={'Project Starter Open, TONStarter Governance'}
                />
                <TextComponent
                  header={'Phase 4'}
                  content={'Tokamak Network Layer2 Integration'}
                />
              </Wrap>
            </Scrollbars>
          </motion.div>
        </motion.div>
      </motion.div>
    </Flex>
  );
};
