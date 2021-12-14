import {
  Grid,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
  Avatar,
  Progress,
} from '@chakra-ui/react';
import {checkTokenType} from 'utils/token';
import {Circle} from 'components/Circle';
import {Link, useRouteMatch} from 'react-router-dom';
import {ActiveProjectType} from '@Starter/types';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {useCallContract} from 'hooks/useCallContract';
import {Contract} from '@ethersproject/contracts';
import * as publicSale from 'services/abis/PublicSale.json';
import {BigNumber} from 'ethers';
import {convertNumber} from 'utils/number';
import moment from 'moment';

type ActiveProjectProp = {
  activeProject: ActiveProjectType[];
};

const ActiveProjectContainer: React.FC<{
  project: ActiveProjectType;
  index: number;
}> = (props) => {
  const {project, index} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {STATER_STYLE} = theme;
  const {library} = useActiveWeb3React();
  const match = useRouteMatch();
  const {url} = match;

  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [totalRaise, setTotalRaise] = useState<string | undefined>(undefined);
  const [participants, setParticipants] = useState<string | undefined>(
    undefined,
  );
  const [step, setStep] = useState<string>('');

  const PUBLICSALE_CONTRACT = useCallContract(
    project.saleContractAddress || '',
    'PUBLIC_SALE',
  );
  const tokenType = checkTokenType(
    '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
  );

  useEffect(() => {
    async function fetchContractData() {
      const roundOneAmount =
        await PUBLICSALE_CONTRACT?.totalExPurchasedAmount();
      const roundTwoAmount = await PUBLICSALE_CONTRACT?.totalDepositAmount();
      const sum = BigNumber.from(roundOneAmount).add(roundTwoAmount);
      const convertedSum = convertNumber({
        amount: sum.toString(),
        localeString: true,
      });

      const progressNow =
        (Number(convertedSum?.replaceAll(',', '')) / 28436) * 100;
      const participantsNum = await PUBLICSALE_CONTRACT?.totalUsers();
      setTotalRaise(convertedSum);
      setProgress(Math.ceil(progressNow));
      setParticipants(participantsNum.toString());
    }
    if (PUBLICSALE_CONTRACT && project) {
      fetchContractData();
    }
  }, [library, project]);

  useEffect(() => {
    const nowTimeStamp = moment().unix();
    const checkStep =
      project.timeStamps.endAddWhiteTime > nowTimeStamp
        ? 'Whitelisting'
        : project.timeStamps.endExclusiveTime > nowTimeStamp
        ? 'Public Round1'
        : project.timeStamps.endDepositTime > nowTimeStamp
        ? 'Public Round2'
        : 'Claim';
    setStep(checkStep);
  }, [project]);
  return (
    <Link to={`${url}/${project.name}`} id={`active_link_${index}`}>
      <Box {...STATER_STYLE.containerStyle({colorMode})}>
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
            <Circle bg={'#f95359'}></Circle>
            <Text
              {...{
                ...STATER_STYLE.subTextBlack({
                  colorMode,
                  fontSize: 16,
                }),
              }}
              ml={'7px'}>
              {step}
            </Text>
          </Flex>
        </Flex>
        <Flex flexDir="column" mb={'25px'}>
          <Text h={'36px'} {...STATER_STYLE.mainText({colorMode})}>
            {project.name}
          </Text>
          <Flex>
            <Text mr={2} {...STATER_STYLE.subText({colorMode})}>
              Sale Date
            </Text>
            <Text {...STATER_STYLE.subTextBlack({colorMode})}>
              {project.saleStart} ~ {project.saleEnd}
            </Text>
          </Flex>
        </Flex>
        <Box d="flex" flexDir="row" justifyContent="space-between" mb={'5px'}>
          <Flex alignItems="center">
            <Text mr={2} {...STATER_STYLE.progress.mainText({colorMode})}>
              Progress
            </Text>
            <Text
              {...STATER_STYLE.progress.percent({
                colorMode,
                isZero: true,
              })}>
              0%
            </Text>
          </Flex>
          <Flex>
            <Text>{totalRaise ? totalRaise : 'XX,XXX'}</Text>
            <Text>/</Text>
            <Text>{project.tokenFundRaisingTargetAmount}</Text>
          </Flex>
        </Box>
        <Box mb={'30px'}>
          <Progress
            value={
              (Number(totalRaise ? totalRaise : '0') /
                Number(project.tokenFundRaisingTargetAmount)) *
              100
            }
            borderRadius={10}
            h={'6px'}></Progress>
        </Box>
        <Flex justifyContent="space-between">
          <Box d="flex" flexDir="column">
            <Text
              {...STATER_STYLE.mainText({
                colorMode,
                fontSize: 14,
              })}>
              Total Raise
            </Text>
            <Box d="flex" alignItems="baseline">
              <Text
                mr={1}
                {...STATER_STYLE.mainText({
                  colorMode,
                  fontSize: 20,
                })}>
                {totalRaise ? totalRaise : 'XX,XXX.XX'}
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
              Participants
            </Text>
            <Text
              mr={1}
              {...STATER_STYLE.mainText({
                colorMode,
                fontSize: 20,
              })}>
              {participants ? participants : 'XX'}
            </Text>
          </Box>
          <Box d="flex" flexDir="column">
            <Text
              {...STATER_STYLE.mainText({
                colorMode,
                fontSize: 14,
              })}>
              Exchange Ratio
            </Text>
            <Box d="flex" justifyContent="space-between">
              <Flex alignItems="baseline">
                <Text
                  {...STATER_STYLE.mainText({
                    colorMode,
                    fontSize: 20,
                  })}>
                  {Number(project.projectTokenRatio) /
                    Number(project.projectTokenRatio)}
                </Text>
                <Text>TON</Text>
              </Flex>
              <Flex alignItems="center">=</Flex>
              <Flex alignItems="baseline">
                <Text
                  {...STATER_STYLE.mainText({
                    colorMode,
                    fontSize: 20,
                  })}>
                  {Number(project.projectFundingTokenRatio) /
                    Number(project.projectTokenRatio)}
                </Text>
                <Text>{project.tokenName}</Text>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export const ActiveProject = (props: ActiveProjectProp) => {
  const {activeProject} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const match = useRouteMatch();

  const {STATER_STYLE} = theme;
  const {url} = match;

  const [progress, setProgress] = useState<number | undefined>(undefined);

  return (
    <Flex flexDir="column">
      <Text
        {...STATER_STYLE.header({colorMode})}
        alignSelf="center"
        mb={'30px'}>
        Active Projects
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={30}>
        {activeProject.map((project, index) => {
          return (
            <ActiveProjectContainer
              project={project}
              index={index}></ActiveProjectContainer>
          );
        })}
      </Grid>
    </Flex>
  );
};
