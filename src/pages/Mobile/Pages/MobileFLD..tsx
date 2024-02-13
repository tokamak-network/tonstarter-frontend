import {Head} from 'components/SEO';
import {Fragment, useState, useEffect} from 'react';
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
import {Link} from 'react-router-dom';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {fetchPoolPayload} from 'pages/Reward/utils/fetchPoolPayload';
import {useAppSelector} from 'hooks/useRedux';
import {selectStakes} from 'pages/Staking/staking.reducer';
import {Stake} from 'pages/Staking/types';
import {useQuery} from 'react-query';
import axios from 'axios';
import {fetchCampaginURL} from 'constants/index';
import {useAppDispatch} from 'hooks/useRedux';
import {fetchProjects} from '@Launch/launch.reducer';
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
  const {account, library} = useActiveWeb3React();
  const [totalStakedAmount, setTotalStakedAmount] = useState('');
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {data} = useAppSelector(selectStakes);
  const [liquidity, setLiquidity] = useState('');
  const [numProjects, setNumProjects] = useState<number>(0);
  const dispatch = useAppDispatch();

  const projects = useQuery(
    ['launchProjects'],
    () =>
      axios.get(fetchCampaginURL, {
        headers: {
          account,
        },
      }),
    {
      // enabled: !!account,
      refetchInterval: 600000,
    },
  );

  const projectsData = projects.data;
  const isProjectsLoading = projects.isLoading;

  useEffect(() => {
    async function calcLiquidity() {
      let totalLiquidity = 0;
      const tvl = await fetchPoolPayload(library);
      if (!tvl) return;
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
  }, [library]);

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

  useEffect(() => {
    if (projectsData && !isProjectsLoading) {
      const {data: datas} = projectsData;
      dispatch(fetchProjects({data: datas}));
      const projects = Object.keys(datas).map((k) => {
        if (datas[k].vaults !== undefined) {
          const stat = datas[k].vaults.every((vault: any) => {
            return vault.isSet === true;
          });
          return {name: datas[k].projectName, key: k, isSet: stat};
        } else {
          return {key: k, data: datas[k], isSet: false};
        }
      });

      const filteredProjects = projects.filter(
        (project: any) => project.isSet === true,
      );
      // console.log(filteredProjects.length);

      setNumProjects(filteredProjects.length + 4);
    }
  }, [data, dispatch]);

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
              TONStarter Decentralized Launchpad Platform
            </Text>
            <Text mt={'50px'} fontSize={'15px'} color={'#ffff07'}>
              Phase1 Total Staked
            </Text>
            <Text fontSize={'25px'}>
              {totalStakedAmount} <span style={{fontSize: '15px'}}>TON</span>
            </Text>
            <Text mt={'21px'} fontSize={'15px'} color={'#ffff07'}>
              Total Ecosystem Value Locked
            </Text>
            <Text fontSize={'25px'}>
              <span style={{fontSize: '25px'}}>$</span> {liquidity}
            </Text>
          </Flex>

          {/* <Text fontSize={'3.438em'} fontWeight={600} mb={'103px'}>
            10D 22:40:24
          </Text> */}
          <Flex w={'100%'}>
            <Container
              w={'50%'}
              p={0}
              h={'390px'}
              borderRightWidth={0.5}
              borderBottomWidth={1}
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
                borderTopWidth={0.5}
                borderBottomWidth={0.5}
                borderColor={whiteWithOpacity}
                w={'100%'}
                h={'390px'}
                pt="39px"
                flexDirection="column"
                justifyContent={'flex-start'}
                alignItems="left"
                pr={'0.750em'}
                pl={'1.250em'}>
                <Text fontSize={'18px'} color={'#ffff07'}>
                  New Feature
                </Text>
                <Text fontSize={'11px'}>
                  Make Your Own Token and Create Token Economy
                </Text>
                <Link to="/launch">
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
                </Link>

                <Text mt={'56px'} fontSize={'11px'}>
                  Raised Capital
                </Text>
                <Text fontSize={'15px'}>$ 7,115,401.98</Text>
                <Text mt={'30px'} fontSize={'11px'}>
                  TOS pairs (in Uniswap)
                </Text>
                <Text fontSize={'15px'}>{numProjects}</Text>
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
