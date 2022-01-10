import {
  Grid,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import {checkTokenType} from 'utils/token';
import {ActiveProjectType} from '@Starter/types';
import starterActions from '../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import moment from 'moment';
import {CustomButton} from 'components/Basic/CustomButton';
import {useCallContract} from 'hooks/useCallContract';
import {convertTimeStamp} from 'utils/convertTIme';

type MyProjectProp = {
  myProject: any[];
};

export const MyProject: React.FC<MyProjectProp> = (props) => {
  const {myProject} = props;
  const {colorMode} = useColorMode();
  const {account, library} = useActiveWeb3React();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  const [vestingDay, setVestingDay] = useState<any[]>();
  const [claimAmount, setClaimAmount] = useState<any[]>();
  const [holding, setHolding] = useState<any[]>();

  useEffect(() => {
    async function getVestingDays(address: string) {
      const vDay = await starterActions.getNextVestingDay({address, library});
      return vDay;
    }
    if (library && myProject) {
      Promise.all(
        myProject.map((project: any) => {
          return getVestingDays(project.saleContractAddress);
        }),
      ).then((data) => {
        setVestingDay(data);
      });
    }
  }, [library, myProject]);

  useEffect(() => {
    async function getClaimAmount(address: string) {
      if (account && library && address) {
        // const userClaimAmount = await starterActions.getCalculClaimAmount({
        //   account,
        //   library,
        //   address,
        // });
        return '0';
        // return userClaimAmount || '0';
      }
    }
    if (account && library && myProject) {
      Promise.all(
        myProject.map((project: any) => {
          return getClaimAmount(project.saleContractAddress);
        }),
      ).then((data) => {
        setClaimAmount(data);
      });
    }
  }, [account, library, myProject]);

  useEffect(() => {
    async function getDepositAmount(address: string) {
      if (account && library && address) {
        const userDeposit = await starterActions.getUserDeposit({
          account,
          library,
          address,
        });
        return userDeposit || '0';
      }
    }
    if (account && library && myProject) {
      Promise.all(
        myProject.map((project: any) => {
          return getDepositAmount(project.saleContractAddress);
        }),
      ).then((data) => {
        setHolding(data);
      });
    }
  }, [account, library, myProject]);

  return (
    <Flex flexDir="column">
      <Text
        {...STATER_STYLE.header({colorMode})}
        alignSelf="center"
        mb={'30px'}>
        My Projects
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={30}>
        {myProject.map((project: any, index: number) => {
          const tokenType = checkTokenType(
            '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
          );
          //   const nowTimeStamp = moment().unix();

          return (
            <Box {...STATER_STYLE.containerStyle({colorMode})} h={'235px'}>
              <Flex justifyContent="space-between" mb={15}>
                <Avatar
                  src={tokenType.symbol}
                  backgroundColor={tokenType.bg}
                  bg="transparent"
                  color="#c7d1d8"
                  name="T"
                  h="48px"
                  w="48px"
                />
                <Flex alignItems="center">
                  <CustomButton
                    text={'Claim'}
                    w={'70px'}
                    h={'26px'}
                    func={() =>
                      account &&
                      starterActions.claim({
                        account,
                        library,
                        address: project?.saleContractAddress,
                      })
                    }
                    style={{
                      bg: '',
                      color: colorMode === 'light' ? '#3d495d' : 'white.100',
                      border: '1px solid #d7d9df',
                      _hover: {
                        border: '1px solid #2a72e5',
                      },
                    }}></CustomButton>
                </Flex>
              </Flex>
              <Flex flexDir="column" mb={'25px'}>
                <Text h={'36px'} {...STATER_STYLE.mainText({colorMode})}>
                  {project.name}
                </Text>
                <Flex>
                  <Text mr={2} {...STATER_STYLE.subText({colorMode})}>
                    Next Claimable Date
                  </Text>
                  <Text {...STATER_STYLE.subTextBlack({colorMode})}>
                    {vestingDay && vestingDay[index]}
                  </Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between">
                <Box d="flex" flexDir="column">
                  <Text
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 14,
                    })}>
                    My Holdings
                  </Text>
                  <Box d="flex" alignItems="baseline">
                    <Text
                      mr={1}
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 20,
                      })}>
                      {holding && holding[index]}
                    </Text>
                    <Text>TON</Text>
                  </Box>
                </Box>
                <Box d="flex" flexDir="column">
                  <Text
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 14,
                    })}>
                    Claimable Amount
                  </Text>
                  <Box d="flex" alignItems="baseline">
                    <Text
                      mr={1}
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 20,
                      })}>
                      {claimAmount && claimAmount[index]}
                    </Text>
                    <Text>TON</Text>
                  </Box>
                </Box>
                <Box d="flex" flexDir="column">
                  <Text
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 14,
                    })}>
                    Left
                  </Text>
                  <Box
                    d="flex"
                    justifyContent="space-between"
                    fontSize={13}
                    w={'32px'}
                    alignItems="baseline">
                    <Flex
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 20,
                      })}>
                      {project.projectTokenRatio}
                    </Flex>
                    <Flex>/</Flex>
                    <Flex>
                      <Text>{project.projectFundingTokenRatio}</Text>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Grid>
    </Flex>
  );
};
