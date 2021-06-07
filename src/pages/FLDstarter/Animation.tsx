import {
  Flex,
  Text,
  Center,
  Container,
  SimpleGrid,
  SkeletonCircle,
  Wrap,
} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';
import {HTMLAttributes} from 'react';
import './Animation.css';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

export const Animation: React.FC<HomeProps> = () => {
  const {colorMode} = useColorMode();
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
            />
            <SkeletonCircle
              size="2"
              pos={'absolute'}
              top={-1}
              right={-1}
              opacity={1}
            />
            <SkeletonCircle
              size="2"
              pos={'absolute'}
              bottom={-1}
              left={-1}
              opacity={1}
            />
            <SkeletonCircle
              size="2"
              pos={'absolute'}
              bottom={-1}
              right={-1}
              opacity={1}
            />
          </>
        );
      }
      if (circle === 'top') {
        return (
          <>
            <SkeletonCircle
              size="2"
              pos={'absolute'}
              top={-1}
              left={-1}
              opacity={1}
            />
            <SkeletonCircle
              size="2"
              pos={'absolute'}
              top={-1}
              right={-1}
              opacity={1}
            />
          </>
        );
      }
      if (circle === 'bottom') {
        return (
          <>
            <SkeletonCircle
              size="2"
              pos={'absolute'}
              bottom={-1}
              left={-1}
              opacity={1}
            />
            <SkeletonCircle
              size="2"
              pos={'absolute'}
              bottom={-1}
              right={-1}
              opacity={1}
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
  return (
    <Flex maxW="100%" height={1024} bg={colorMode==='light'? 'blue.200': 'gray.275' }>
      <Container
        m={0}
        pl={20}
        d="flex"
        flexDirection="column"
        justifyContent="center"
        w="961px"
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
          content={'Generated from the platform growth and individual projects'}
          circle="top"
        />
        <TextComponent
          header={'Permissionless'}
          content={'Fair Opportunity for participation and rewards'}
          borderY="1px solid rgba(255, 255, 255, 0.25)"
          borderRadius="10px dotted black"
          circle="all"
        />
        <TextComponent
          header={'Transparent'}
          content={
            'FLD holders can participate in all platform decisions by staking FLD into sFLD (staked FLD)'
          }
          circle="bottom"
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
    </Flex>
  );
};
