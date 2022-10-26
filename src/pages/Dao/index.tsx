import {
  Box,
  Flex,
  Text,
  Container,
  Image,
  useColorMode,
  useTheme,
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
      <Flex  w="100%" flexDir="column">
        <Flex justifyContent="center">
          <Flex w={572} mr={158} mt={'70px'} flexDir="column">
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
          <Flex mt={'70px'}>
            <STOS></STOS>
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