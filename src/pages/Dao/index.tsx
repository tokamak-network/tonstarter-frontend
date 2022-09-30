import {
  Box,
  Flex,
  Text,
  Container,
  Image,
  useColorMode,
  useTheme,
  Link,
} from '@chakra-ui/react';
import resources_icon from 'assets/svgs/resources_icon.svg';
import {STOS} from './components/STOS';
import {DAOStatistics} from './components/DAOStatistics';
import {
  DaoStakeModal,
  DaoUnstakeModal,
  DaoManageModal,
  DaoClaim,
} from './components/Modals';
import {Utility} from './components/Utility';
import {DistributeModal} from 'pages/Admin/components/DistributeModal';

const Notice = () => {
  const theme = useTheme();
  return (
    <Flex flexDir={'column'} mt={'39px'}>
      <Flex fontSize={20} fontWeight={'bold'}>
        <Text color={'#2a72e5'}>[Notice]</Text>
        <Text ml={'3px'}>
          Planned service maintenance & smart contract upgrade announcement
        </Text>
      </Flex>
      <Flex
        fontSize={15}
        flexDir={'column'}
        mt={'15px'}
        fontFamily={theme.fonts.fld}>
        <Text>
          Sometime between October ~ November 2022, TONStarter’s DAO page will
          be deprecated and moved under the new TOSv2’s DAO page. TONStarter DAO
          page’s “Manage”,
        </Text>
        <Text>
          “Unstake”, “Stake” functionality will not work for up to 24 hours to
          upgrade the TOSv2 staking contract. The exact schedule will be updated
          later.
        </Text>
        <Flex>
          <Text>Check our medium article [</Text>
          <Link
            color={'#2a72e5'}
            isExternal={true}
            href="https://medium.com/onther-tech/tonstarter-planned-service-maintenance-smart-contract-upgrade-announcement-4362b02403c2">
            EN
          </Link>
          ,
          <Link
            color={'#2a72e5'}
            isExternal={true}
            href="https://medium.com/onther-tech/%ED%86%A4%EC%8A%A4%ED%83%80%ED%84%B0-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%9C%A0%EC%A7%80-%EB%B3%B4%EC%88%98-%EB%B0%8F-%EC%8A%A4%EB%A7%88%ED%8A%B8-%EC%BB%A8%ED%8A%B8%EB%9E%99%ED%8A%B8-%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C-%EA%B3%B5%EC%A7%80-eaea40e9c8f6">
            KR
          </Link>
          <Text>] for more details.</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const DAO = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const themeDesign = {
    fontColor: {
      light: 'gray.250',
      dark: 'white.100',
    },
    bg: {
      light: 'white.100',
      dark: 'black.200',
    },
    border: {
      light: 'solid 1px #d7d9df',
      dark: 'solid 1px #535353',
    },
  };

  return (
    <Flex mb={'105px'}>
      <Flex
        mt={theme.headerMargin.mt}
        w="100%"
        flexDir="column"
        justifyContent={'center'}
        alignItems={'center'}>
        <Flex flexDir={'column'}>
          <Notice></Notice>
          <Flex>
            <Flex w={572} mr={158} mt={'60px'} flexDir="column">
              <Box mb={'45px'}>
                <Text
                  color={themeDesign.fontColor[colorMode]}
                  fontSize={'2.375em'}
                  fontWeight={'bold'}
                  mb="10px">
                  DAO
                </Text>
                <Text color={'gray.400'} fontSize={'1.000em'}>
                  Stake TOS and get sTOS. sTOS token is required to obtain the
                  rights for decision-making or sharing additional profit made
                  from the TONStarter platform.
                </Text>
              </Box>
              <Flex>
                <Container p={0} m={0} display="flex">
                  <Box mb="30px">
                    <Text
                      fontSize={'1.250em'}
                      color={themeDesign.fontColor[colorMode]}
                      mb={'10px'}
                      fontWeight={600}>
                      Governance
                    </Text>
                    <Text fontSize={'1em'} color={'gray.400'}>
                      Go vote and and be an owner of TONStarter
                    </Text>
                  </Box>
                  <Box
                    w={160}
                    h="38px"
                    ml={'40px'}
                    mt={'31px'}
                    bg={themeDesign.bg[colorMode]}
                    color={themeDesign.fontColor[colorMode]}
                    borderRadius={4}
                    border={themeDesign.border[colorMode]}
                    fontSize="0.813em"
                    fontWeight={600}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={15}
                    cursor={'pointer'}
                    _hover={{color: '#2a72e5', borderColor: '#2a72e5'}}>
                    <Text
                      onClick={(e: any) => {
                        window.open(`https://snapshot.org/#/tonstarter.eth`);
                      }}>
                      Go to governance
                    </Text>
                    <Image src={resources_icon}></Image>
                  </Box>
                </Container>
              </Flex>
              <Flex flexDir="column" w={636}>
                <DAOStatistics></DAOStatistics>
                <Utility></Utility>
              </Flex>
            </Flex>
            <Flex mt={'57px'}>
              <STOS></STOS>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <DaoStakeModal></DaoStakeModal>
      <DaoUnstakeModal></DaoUnstakeModal>
      <DaoManageModal></DaoManageModal>
      <DaoClaim></DaoClaim>
      <DistributeModal></DistributeModal>
    </Flex>
  );
};
