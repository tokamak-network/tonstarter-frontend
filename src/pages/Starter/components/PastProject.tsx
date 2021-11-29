import {
  Grid,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
  Progress,
} from '@chakra-ui/react';
import {Link, useRouteMatch} from 'react-router-dom';
import {TokenImage} from '@Admin/components/TokenImage';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {PastProjectType} from '@Starter/types';
import {useEffect, useState} from 'react';
import {useCallContract} from 'hooks/useCallContract';
import {BigNumber} from 'ethers';
import {convertNumber} from 'utils/number';

type PastProjectProp = {
  pastProject: PastProjectType[];
};

const PastProjectContainer: React.FC<{
  project: PastProjectType;
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

  const PUBLICSALE_CONTRACT = useCallContract(
    project.saleContractAddress || '',
    'PUBLIC_SALE',
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
        (Number(convertedSum?.replaceAll(',', '')) /
          Number(project.tokenFundRaisingTargetAmount.replaceAll(',', ''))) *
        100;
      const participantsNum = await PUBLICSALE_CONTRACT?.totalUsers();
      setTotalRaise(convertedSum);
      setProgress(progressNow);
      setParticipants(participantsNum.toString());
    }
    if (PUBLICSALE_CONTRACT && project) {
      fetchContractData();
    }
  }, [library, project, PUBLICSALE_CONTRACT]);

  return (
    <Link to={`${url}/${project.name}`} id={`past_link_${index}`}>
      <Box {...STATER_STYLE.containerStyle({colorMode})} h={'259px'}>
        <Flex justifyContent="space-between" mb={15}>
          <TokenImage imageLink={project.tokenSymbolImage}></TokenImage>
        </Flex>
        <Flex flexDir="column" mb={'15px'}>
          <Text h={'36px'} {...STATER_STYLE.mainText({colorMode})}>
            {project.name}
          </Text>
        </Flex>

        <Flex mb={'20px'}>
          <Box d="flex" flexDir="column" w={'135px'}>
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
              <Text>{project.fundingTokenType}</Text>
            </Box>
          </Box>
          <Box d="flex" flexDir="column" w={'99px'}>
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
          {/* <Box d="flex" flexDir="column">
                    <Text
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 14,
                      })}>
                      ROI
                    </Text>
                    <Box d="flex" justifyContent="space-between">
                      <Flex alignItems="baseline">
                        <Text
                          {...STATER_STYLE.mainText({
                            colorMode,
                            fontSize: 20,
                          })}>
                          300
                        </Text>
                        <Text>%</Text>
                      </Flex>
                    </Box>
                  </Box> */}
        </Flex>
        <Box d="flex" flexDir="row" justifyContent="space-between" mb={'5px'}>
          <Flex alignItems="center">
            <Text
              mr={1}
              {...STATER_STYLE.progress.mainText({
                colorMode,
                fontSize: 13,
              })}>
              Public Sale
            </Text>
            <Box
              w={'12px'}
              h={'3px'}
              bg={'blue.100'}
              borderRadius={10}
              mr={'25px'}></Box>
            <Text
              mr={1}
              {...STATER_STYLE.progress.mainText({
                colorMode,
                fontSize: 13,
              })}>
              current
            </Text>
            <Box
              w={'12px'}
              h={'3px'}
              bg={'#2bb415'}
              borderRadius={10}
              mr={'20px'}></Box>
          </Flex>
          <Flex
            {...{
              ...STATER_STYLE.subTextBlack({colorMode, fontSize: 12}),
            }}>
            <Text>{progress + ' %' || 'XXX %'}</Text>
          </Flex>
        </Box>
        <Box mb={'30px'}>
          <Progress
            value={progress ? (100 - progress < 0 ? 0 : 100 - progress) : 50}
            borderRadius={10}
            h={'6px'}
            bg={'#2bb415'}></Progress>
        </Box>
      </Box>
    </Link>
  );
};

export const PastProject = (props: PastProjectProp) => {
  const {pastProject} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {STATER_STYLE} = theme;

  return (
    <Flex flexDir="column">
      <Text
        {...STATER_STYLE.header({colorMode})}
        alignSelf="center"
        mb={'30px'}>
        Past Projects
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={30}>
        {pastProject.map((project, index) => {
          return (
            <PastProjectContainer
              project={project}
              index={index}></PastProjectContainer>
          );
        })}
      </Grid>
    </Flex>
  );
};
