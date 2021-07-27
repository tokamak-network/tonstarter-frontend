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
import resources_icon_blue from 'assets/svgs/resources_icon_blue.svg';
import {STOS} from './components/STOS';
import {
  DaoStakeModal,
  DaoUnstakeModal,
  DaoManageModal,
} from './components/Modals';

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
    <Flex>
      <Flex mt={theme.headerMargin.mt} w="100%" justifyContent="center">
        <Flex w={572} mr={108} mt={'122px'} flexDir="column">
          <Box mb={'45px'}>
            <Text
              color={themeDesign.fontColor[colorMode]}
              fontSize={'2.375em'}
              fontWeight={'bold'}
              mb="10px">
              DAO
            </Text>
            <Text color={'gray.400'} fontSize={'1.000em'}>
              Staking TOS and get sTOS. sTOS token is required to obtain the
              rights for decision-making or sharing additional profit made from
              the TONStarter platform.
            </Text>
          </Box>
          <Flex>
            <Container p={0} m={0} mr={120}>
              <Box mb="30px">
                <Text
                  fontSize={'1.250em'}
                  color={themeDesign.fontColor[colorMode]}
                  mb={'10px'}
                  fontWeight={600}>
                  Forum
                </Text>
                <Text w="184px" fontSize={'1em'} color={'gray.400'}>
                  Check and discuss for the latest proposals
                </Text>
              </Box>
              <Box
                w={150}
                h="38px"
                mb="220px"
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
                cursor={'pointer'}>
                <Text>Go to forum</Text>
                <Image src={resources_icon}></Image>
              </Box>
            </Container>
            <Container p={0} m={0}>
              <Box mb="30px">
                <Text
                  fontSize={'1.250em'}
                  color={themeDesign.fontColor[colorMode]}
                  mb={'10px'}
                  fontWeight={600}>
                  Governance
                </Text>
                <Text w={188} fontSize={'1em'} color={'gray.400'}>
                  Go vote and and be owner of TONStarter
                </Text>
              </Box>
              <Box
                w={160}
                h="38px"
                mb="220px"
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
                cursor={'pointer'}>
                <Text>Go to governance</Text>
                <Image src={resources_icon}></Image>
              </Box>
            </Container>
          </Flex>
        </Flex>
        <Flex mt={75}>
          <STOS></STOS>
        </Flex>
      </Flex>
      <DaoStakeModal></DaoStakeModal>
      <DaoUnstakeModal></DaoUnstakeModal>
      <DaoManageModal></DaoManageModal>
    </Flex>
  );
};
