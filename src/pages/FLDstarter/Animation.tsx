import {
  Flex,
  Text,
  Center,
  Container,
  SimpleGrid,
  SkeletonCircle,
  Wrap,
  WrapItem,
  Image,
} from '@chakra-ui/react';
import {motion} from 'framer-motion';
import {HTMLAttributes, useEffect, useState} from 'react';
import {useWindowDimensions} from 'hooks/useWindowDimentions';
import FLDLogo from 'assets/svgs/fld_bi_c.svg';
import './Animation.css';
import {composeInitialProps} from 'react-i18next';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

const TextComponent = (props: any) => {
  const {header, content, circle, ...rest} = props;
  const makeCircles = () => {
    if (circle === 'all') {
      return (
        <>
          <SkeletonCircle
            size="2"
            pos={'absolute'}
            top={-1}
            left={-1}
            opacity={1}
            style={{WebkitAnimation: 'none', background: '#ffffff'}}
          />
          <SkeletonCircle
            size="2"
            pos={'absolute'}
            top={-1}
            right={-1}
            opacity={1}
            style={{WebkitAnimation: 'none', background: '#ffffff'}}
          />
          <SkeletonCircle
            size="2"
            pos={'absolute'}
            bottom={-1}
            left={-1}
            opacity={1}
            style={{WebkitAnimation: 'none', background: '#ffffff'}}
          />
          <SkeletonCircle
            size="2"
            pos={'absolute'}
            bottom={-1}
            right={-1}
            opacity={1}
            style={{WebkitAnimation: 'none', background: '#ffffff'}}
          />
        </>
      );
    }
  };
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
      {makeCircles()}
    </Center>
  );
};

const makeCircle = (left: number, top: number) => {
  return (
    <SkeletonCircle
      size="1"
      pos={'absolute'}
      top={top}
      left={left === 0 ? 77 : 77 + left * 140}
      opacity={1}
      style={{WebkitAnimation: 'none', background: '#ffffff'}}
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
  const leftMargin = 81;
  const distantMargin = 140;
  const middlePoint =
    rowDots.length % 2 !== 0
      ? Math.round(rowDots.length / 2) - 1
      : Math.floor(rowDots.length / 2) - 1;
  console.log(rowDots.length);
  console.log(middlePoint);
  console.log(leftMargin + middlePoint * 140);
  return leftMargin + middlePoint * 140;
};

export const Animation: React.FC<HomeProps> = () => {
  const {width} = useWindowDimensions();
  const [rowDots, setRowDots] = useState<number[]>([]);
  const verticalDots: number[] = [77, 221, 365, 509, 653, 797, 941];

  useEffect(() => {
    const result = makeDots(Number(width), 1024);
    console.log('width : ' + width);
    setRowDots(result);
  }, [width]);

  return (
    <Flex maxW="100%" height={1024} bg="blue.200" position="relative">
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
              transition={{delay: rIndex + cIndex}}>
              {makeCircle(rIndex, c)}
            </motion.div>
          );
        }),
      )}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        style={{display: 'flex'}}>
        <Container
          m={0}
          p={0}
          w={getLeftArea(rowDots)}
          d="flex"
          flexDirection="column"
          justifyContent="center"
          color="white.100"
          fontWeight="semibold"
          fontSize={52}>
          <Text>FLD Starter</Text>
          <Text>Decentralized Launchpad</Text>
          <Text>Platform</Text>
        </Container>
        <SimpleGrid
          d="flex"
          flexDirection="column"
          justifyContent="center"
          w="291px"
          color="white.100"
          borderX="1px solid rgba(255, 255, 255, 0.25)">
          <TextComponent
            header={'Dual Profit'}
            content={
              'generated from the platform growth and individual projects'
            }
          />
          <TextComponent
            header={'Permissionless'}
            content={'Fair Opportunity to participation and rewards'}
            borderY="1px solid rgba(255, 255, 255, 0.25)"
            borderRadius="10px dotted black"
            circle="all"
          />
          <TextComponent
            header={'Transparent'}
            content={
              'FLD holders can participate in all platform decisions by staking FLD into sFLD(staked FLD)'
            }
          />
        </SimpleGrid>
        <Wrap
          w="291px"
          pt={676}
          borderRight="1px solid rgba(255, 255, 255, 0.25)"
          color="white.100"
          overflowY="auto"
          overflowX="hidden"
          flexDirection="column"
          className="main-scroll">
          <Text pl={25} fontSize="26px" fontWeight={'bold'}>
            ROAD MAP
          </Text>
          <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
          <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
          <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
          <TextComponent header={'Phase1'} content={'Launch FLD Mining'} />
        </Wrap>
      </motion.div>
    </Flex>
  );
};
