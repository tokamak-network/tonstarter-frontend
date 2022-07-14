import {Head} from 'components/SEO';
import {Fragment, useState} from 'react';
import {
  Flex,
  Text,
  Image,
  Container,
  useTheme,
  Center,
  useColorMode,
  Box,
} from '@chakra-ui/react';
import logoDark from 'assets/svgs/fldw_bi.svg';

const whiteWithOpacity = `rgba(255, 255, 255, 0.5)`;

const TextComponent = (props: any) => {
  const {
    header,
    content,
    contentWidth,
    borderColor,
    mainFontSize,
    subFontSize,
    ...rest
  } = props;
  const {colorMode} = useColorMode();
  return (
    <Center
      w={'100%'}
      height="130px"
      flexDirection="column"
      alignContent="center"
      alignItems="left"
      pr={'0.750em'}
      pl={'1.250em'}
      borderTopWidth={1}
      borderColor={borderColor === undefined ? whiteWithOpacity : borderColor}
      {...rest}>
      <Text
        fontSize={mainFontSize === undefined ? '1.125em' : mainFontSize}
        fontWeight={'bold'}>
        {header}
      </Text>
      <Text
        w={contentWidth}
        h="0.75em"
        fontSize={subFontSize === undefined ? '0.625em' : subFontSize}
        fontWeight={300}
        opacity={0.75}>
        {content}
      </Text>
    </Center>
  );
};

export const MobileFLD = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [totalStakedAmount, setTotalStakedAmount] = useState('');

  return (
    <Fragment>
      <Flex
        bg={colorMode === 'light' ? '#007aff' : '#222222'}
        w={'100%'}
        flexDir={'column'}
        fontFamily={theme.fonts.fld}
        color="white.100">
        <Flex
          mt={'35px'}
          flexDir="column"
          alignItems="center"
          justifyContent="center">
          <Flex
            w={'100%'}
            mb={'45px'}
            pl={'20px'}
            flexDir="column"
            alignItems="flex-start"
            fontWeight={600}>
            <Text w={'280px'} fontSize={'27px'} wordBreak={'break-word'}>
              TON Starter Decentralized Launchpad Platform
            </Text>
            <Text mt={'50px'} fontSize={'15px'} color={'#ffff07'}>
              Phase1 Total Staked
            </Text>
            <Text fontSize={'25px'}>
              2,646,790.91 <span style={{fontSize: '15px'}}>TON</span>
            </Text>
            <Text mt={'21px'} fontSize={'15px'} color={'#ffff07'}>
              Phase 2 Total WTON-TOS liquidity
            </Text>
            <Text fontSize={'25px'}>
              2,646,790.91 <span style={{fontSize: '15px'}}>TON</span>
            </Text>
          </Flex>

          {/* <Text fontSize={'3.438em'} fontWeight={600} mb={'103px'}>
            10D 22:40:24
          </Text> */}
          <Flex w={'100%'}>
            <Container
              w={'50%'}
              p={0}
              borderRightWidth={1}
              borderRightColor={whiteWithOpacity}>
              <TextComponent
                header="Dual Profit"
                content="generated from the platform growth and individual projects"
                contentWidth={'133px'}></TextComponent>
              <TextComponent
                header="Permissionless"
                content="Fair Opportunity to participation and rewards"
                contentWidth={'141px'}></TextComponent>
              <TextComponent
                header="Transparent"
                content="TOS holders can participate in all 
platform decisions by staking TON 
into sTOS(staked TOS)"
                contentWidth={'148px'}></TextComponent>
            </Container>
            <Container pos="relative" w={'50%'} p={0}>
              <Center
                borderTopWidth={1}
                borderColor={whiteWithOpacity}
                w={'100%'}
              pt='39px'
                flexDirection="column"
                alignItems="left"
                pr={'0.750em'}
                pl={'1.250em'}>
                <Text fontSize={'18px'} color={'#ffff07'}>
                  New Feature
                </Text>
                <Text fontSize={'11px'}>
                  Make Your Own Token and Create Token Economy
                </Text>
                <Box
                  w={'106px'}
                  mt={'25px'}
                  h={'24px'}
                  border={
                    colorMode == 'light'
                      ? '1px solid #409cff'
                      : '1px solid #535353'
                  }
                  borderRadius="4px"
                  fontSize={'11px'}
                  display="flex"
                  justifyContent={'center'}
                  alignItems="center">
                  Launched Projects
                </Box>
                <Text mt={'56px'} fontSize={'11px'}>
                 Raised Capital
                </Text>
                <Text fontSize={'15px'}>$ 7,115,401.98</Text>
                <Text mt={'30px'} fontSize={'11px'}>
                TOS pairs (in Uniswap)
                </Text>
                <Text fontSize={'15px'}>20</Text>
              </Center>
              {/* <TextComponent
                header="Phase1"
                content="TOS Liquidity Mining Launch"></TextComponent>
              <TextComponent
                borderColor= {colorMode === 'light'?"blue.200" : "#222222" }
                header="Phase2"
                content=" TOS staking, LP staking"
                contentWidth={'99px'}></TextComponent>
              <TextComponent
                 borderColor= {colorMode === 'light'?"blue.200" : "#222222" }
                contentWidth={'121px'}
                header="Phase3"
                content="Project Starter Open TONStarter Governance"></TextComponent> */}
            </Container>
          </Flex>
        </Flex>
      </Flex>
    </Fragment>
  );
};
