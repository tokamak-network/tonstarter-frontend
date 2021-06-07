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
import {motion, useAnimation} from 'framer-motion';
import {HTMLAttributes, useEffect, useState} from 'react';
import {useWindowDimensions} from 'hooks/useWindowDimentions';
import FLDLogo from 'assets/svgs/fld_bi_c.svg';
import Arrow from 'assets/svgs/select1_arrow_inactive.svg';
import './Animation.css';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

const elements = {
  marinLeft: 81,
  distanceMargin: 140,
  circleSize: '1',
  circleColor: '#ffffff',
  whiteWithOpacity: `rgba(255, 255, 255, 0.5)`,
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
          className="test"
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
      pos={'relative'}
      {...rest}>
      <Text fontSize="26px" fontWeight={'bold'}>
        {header}
      </Text>
      <Text fontSize="15px" fontWeight={300}>
        {content}
      </Text>
      {/* {circle && delay ? addCircles({delay: delay}) : ''} */}
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
  return leftMargin + middlePoint * distantMargin;
};

export const Animation: React.FC<HomeProps> = () => {
  const {width} = useWindowDimensions();
  const [rowDots, setRowDots] = useState<number[]>([]);
  const [timer] = useState({
    firstLine: 0,
    scondLine: 2,
    circles: 3,
    innerLine: 4,
    mainText: 6,
    subText: 7,
    lastPhase: 10,
    lastCircle: 11,
  });
  const verticalDots: number[] = [77, 221, 365, 509, 653, 797, 941];

  const mainControls = useAnimation();
  const mainSubControls = useAnimation();
  const secondPhaseControls = useAnimation();
  const secondSubPhaseControls = useAnimation();
  const lastPhase = useAnimation();
  const circleControls = useAnimation();
  const lastCircleControls = useAnimation();

  useEffect(() => {
    const result = makeDots(Number(width), 1024);
    console.log('width : ' + width);
    setRowDots(result);

    mainControls.start((i) => ({
      borderLeftWidth: [null, '1px', '1px'],
      borderRightWidth: [null, '1px', '1px'],
      borderLeftColor: [
        null,
        `${elements.whiteWithOpacity}`,
        `${elements.whiteWithOpacity}`,
      ],
      borderRightColor: [null, '#007AFF', `${elements.whiteWithOpacity}`],

      transition: {
        delay: result.length / 2 + i,
        duration: 2,
        times: [0, 0.5, 1],
      },
    }));

    mainSubControls.start((i) => ({
      borderRightWidth: '1px',
      borderRightColor: `${elements.whiteWithOpacity}`,
      opacity: 1,
      transition: {
        delay: result.length / 2 + i,
        duration: 2,
      },
    }));

    secondPhaseControls.start((i) => ({
      borderTopColor: [
        null,
        `${elements.whiteWithOpacity}`,
        `${elements.whiteWithOpacity}`,
      ],
      borderBottomColor: [null, '#007AFF', `${elements.whiteWithOpacity}`],
      opacity: 1,
      transition: {
        delay: result.length / 2 + i,
        duration: 3,
        times: [0, 0.5, 1],
      },
    }));

    secondSubPhaseControls.start((i) => ({
      opacity: 1,
      transition: {
        delay: result.length / 2 + i,
      },
    }));

    lastPhase.start((i) => ({
      opacity: 1,
      transition: {
        delay: result.length / 2 + i,
      },
    }));

    circleControls.start((i) => ({
      opacity: 1,
      transition: {
        delay: result.length / 2 + i,
      },
    }));

    lastCircleControls.start((i) => ({
      opacity: 1,
      transition: {
        delay: result.length / 2 + i,
        // duration: 2,
      },
    }));
  }, [width, mainControls]);

  return (
    <Flex maxW="100%" height={1024} bg="blue.200" position="relative">
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
          bg="blue.200"
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
        transition={{duration: 2}}>
        <Center>
          <Image src={FLDLogo}></Image>
        </Center>
      </motion.div>
      {rowDots.map((r, rIndex) =>
        verticalDots.map((c, cIndex) => {
          return (
            <motion.div
              style={{position: 'relative'}}
              initial={{opacity: 1}}
              animate={{opacity: getCondition(rIndex, cIndex) === true ? 1 : 0}}
              transition={{delay: (rIndex + cIndex) / 10}}>
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
        }}
        initial={{opacity: 1}}>
        <motion.div
          custom={timer.mainText}
          initial={{opacity: 0}}
          animate={secondSubPhaseControls}>
          <Container
            m={0}
            p={0}
            w={getLeftArea(rowDots)}
            d="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            color="white.100"
            fontWeight="semibold"
            fontSize={52}>
            <div>
              <Text>FLD Starter</Text>
              <Text>Decentralized Launchpad</Text>
              <Text>Platform</Text>
            </div>
          </Container>
        </motion.div>
        <motion.div
          initial={{
            borderColor: '#007AFF',
            // y: -1024,
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
                borderColor: '#007AFF',
              }}
              custom={timer.innerLine}
              animate={secondPhaseControls}
              style={{position: 'relative'}}>
              {addCircles({animate: circleControls, custom: timer.circles})}
              <motion.div
                custom={timer.subText + 1}
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
              custom={timer.subText + 2}
              initial={{opacity: 0}}
              animate={secondSubPhaseControls}>
              <TextComponent
                header={'Transparent'}
                content={
                  'FLD holders can participate in all platform decisions by staking FLD into sFLD(staked FLD)'
                }
              />
            </motion.div>
          </SimpleGrid>
        </motion.div>
        <motion.div
          custom={timer.scondLine}
          initial={{opacity: 0}}
          animate={mainSubControls}
          style={{display: 'flex', height: '100%'}}>
          <motion.div
            custom={timer.lastPhase}
            initial={{opacity: 0}}
            animate={lastPhase}>
            <Wrap
              w="279px"
              pt="676px"
              color="white.100"
              overflowY="auto"
              overflowX="hidden"
              flexDirection="column"
              className="main-scroll"
              m={0}
              style={{display: 'flex', height: '100%'}}>
              <Text pl={25} fontSize="26px" fontWeight={'bold'}>
                ROAD MAP
              </Text>
              <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
              <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
              <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
              <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
            </Wrap>
          </motion.div>
        </motion.div>
      </motion.div>
    </Flex>
  );
};
