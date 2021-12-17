import {
  Grid,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
  Progress,
} from '@chakra-ui/react';
import {Circle} from 'components/Circle';
import {Link, useRouteMatch} from 'react-router-dom';
import {ActiveProjectType} from '@Starter/types';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {useCallContract} from 'hooks/useCallContract';
import {convertNumber} from 'utils/number';
import moment from 'moment';
import {TokenImage} from '@Admin/components/TokenImage';

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

  const [progress, setProgress] = useState<number>(0);
  const [totalRaise, setTotalRaise] = useState<string | undefined>(undefined);
  const [participants, setParticipants] = useState<string | undefined>(
    undefined,
  );
  const [step, setStep] = useState<string>('');

  const [pro1, setPro1] = useState<string>('XXX,XXX');
  const [pro2, setPro2] = useState<string>('XXX,XXX');

  const PUBLICSALE_CONTRACT = useCallContract(
    project.saleContractAddress || '',
    'PUBLIC_SALE',
  );

  useEffect(() => {
    async function fetchContractData() {
      const {step} = project;

      const totalRaise =
        step === 'whitelist' || step === 'exclusive'
          ? await PUBLICSALE_CONTRACT?.totalExPurchasedAmount()
          : await PUBLICSALE_CONTRACT?.totalDepositAmount();
      const totalExSaleAmount =
        step === 'whitelist' || step === 'exclusive'
          ? await PUBLICSALE_CONTRACT?.totalExSaleAmount()
          : await PUBLICSALE_CONTRACT?.totalOpenSaleAmount();
      const totalExpectSaleAmount =
        step === 'whitelist' || step === 'exclusive'
          ? await PUBLICSALE_CONTRACT?.totalExpectSaleAmount()
          : await PUBLICSALE_CONTRACT?.totalExpectOpenSaleAmountView();
      const participantsNum =
        step === 'whitelist'
          ? await PUBLICSALE_CONTRACT?.totalWhitelists()
          : step === 'exclusive'
          ? await PUBLICSALE_CONTRACT?.totalRound1Users()
          : await PUBLICSALE_CONTRACT?.totalRound2Users();

      const convertedTotalRaised = convertNumber({
        amount: totalRaise.toString(),
        localeString: true,
      });
      const convertedPro1 = (await convertNumber({
        amount: totalExSaleAmount.toString(),
        localeString: true,
      })) as string;
      const convertedPro2 = (await convertNumber({
        amount: totalExpectSaleAmount.toString(),
        localeString: true,
      })) as string;

      const progressNow =
        (Number(totalExSaleAmount.toString()) /
          Number(totalExpectSaleAmount.toString())) *
        100;

      setPro1(convertedPro1 || 'XXX,XXX');
      setPro2(convertedPro2 || 'XXX,XXX');

      setTotalRaise(convertedTotalRaised);
      setProgress(Math.ceil(progressNow));
      setParticipants(participantsNum.toString());
    }
    if (PUBLICSALE_CONTRACT && project) {
      fetchContractData();
    }
  }, [library, project, PUBLICSALE_CONTRACT]);

  useEffect(() => {
    const nowTimeStamp = moment().unix();
    const checkStep =
      project.timeStamps.endAddWhiteTime > nowTimeStamp
        ? 'Whitelisting'
        : project.timeStamps.endExclusiveTime > nowTimeStamp
        ? 'Public Round 1'
        : project.timeStamps.endDepositTime > nowTimeStamp
        ? 'Public Round 2'
        : 'Claim';
    setStep(checkStep);
  }, [project]);

  return (
    <Link to={`${url}/${project.name}`} id={`active_link_${index}`}>
      <Box {...STATER_STYLE.containerStyle({colorMode})}>
        <Flex justifyContent="space-between" mb={15}>
          <TokenImage imageLink={project.tokenSymbolImage}></TokenImage>
          <Flex alignItems="center">
            <Circle
              bg={step === 'Public Round 2' ? '#2ea2f8' : '#f95359'}></Circle>
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
              })}
              color={'#0070ed'}>
              {progress} %
            </Text>
          </Flex>
          <Flex>
            <Text>{pro1 || 'XX,XXX'}</Text>
            <Text>/</Text>
            <Text>{pro2 || 'XX.XXX'}</Text>
          </Flex>
        </Box>
        <Box mb={'30px'}>
          <Progress value={progress} borderRadius={10} h={'6px'}></Progress>
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
                {totalRaise || 'XX,XXX,XXX'}
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
              {participants || 'XX,XXX'}
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
  const {STATER_STYLE} = theme;

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
