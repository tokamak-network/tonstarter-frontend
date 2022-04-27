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
import {TokenImage} from '../../Admin/components/TokenImage';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {ProjectCardType} from '@Launch/types';
import {useEffect, useState} from 'react';
import {useCallContract} from 'hooks/useCallContract';
import {BigNumber} from 'ethers';
import {convertNumber} from 'utils/number';

const ProjectCard: React.FC<{
  project: ProjectCardType;
  index: number;
}> = (props) => {
  const {project, index} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {STATER_STYLE} = theme;
  const {library} = useActiveWeb3React();
  const match = useRouteMatch();
  const {url} = match;

  const [progress, setProgress] = useState<number | undefined>();
  const [totalRaise, setTotalRaise] = useState<string | undefined>(undefined);
  const [participants, setParticipants] = useState<string | undefined>(
    undefined,
  );

  const PUBLICSALE_CONTRACT = useCallContract(
    // project.saleContractAddress ||
    '',
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
        (Number(convertedSum?.replaceAll(',', '')) / 28436) * 100;
      const participantsNum = await PUBLICSALE_CONTRACT?.totalUsers();
      setTotalRaise(convertedSum);
      setProgress(Math.ceil(progressNow));
      setParticipants(participantsNum.toString());
    }
    if (PUBLICSALE_CONTRACT && project) {
      fetchContractData();
    }
  }, [library, project, PUBLICSALE_CONTRACT]);

  return (
    <Link to={`${url}/project/${project.data.projectName}`} id={`past_link_${index}`}>
      <Box {...STATER_STYLE.containerStyle({colorMode})} h={'275px'}>
        <Flex justifyContent="space-between" mb={'10px'}>
          <TokenImage></TokenImage>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Box w={'7px'} h={'7px'} bg={'red'} borderRadius={10} mr={'8px'} />
            <Text>Started</Text>
          </Flex>
        </Flex>
        <Flex flexDir="column">
          <Text h={'36px'} {...STATER_STYLE.mainText({colorMode})}>
            {project.data.projectName}
          </Text>
        </Flex>
        <Flex mb={'15px'}>
          <Text
            {...{
              ...STATER_STYLE.subTextBlack({colorMode, fontSize: 12}),
            }}
            color={colorMode === 'light' ? 'gray.125' : 'gray.475'}
            mr={'8px'}>
            Sale Date: 
          </Text>
          <Text
            {...{
              ...STATER_STYLE.mainText({colorMode, fontSize: 12}),
            }}>
              {project.data.vaults[0].vaultName}
            {/* {project.saleStart} - {project.saleEnd} */}
          </Text>
        </Flex>

        <Box d="flex" flexDir="row" justifyContent="space-between" mb={'5px'}>
          <Flex alignItems="center" flexDirection={'row'}>
            <Text
              mr={1}
              {...STATER_STYLE.progress.mainText({
                colorMode,
                fontSize: 13,
              })}
              color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
              Current
            </Text>
            <Text ml={'3px'} color={'blue.400'} fontSize={'13px'}>
              {progress === undefined ? 'XXX %' : progress + ' %'}
            </Text>
          </Flex>
          <Flex
            {...{
              ...STATER_STYLE.subTextBlack({colorMode, fontSize: 12}),
            }}
            color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
            <Text>current / hard cap</Text>
          </Flex>
        </Box>
        <Box mb={'30px'}>
          <Progress
            value={progress ? (100 - progress < 0 ? 0 : 100 - progress) : 50}
            borderRadius={10}
            h={'6px'}
            bg={'#2bb415'}
          />
        </Box>
        <Flex mb={'20px'} justifyContent={'space-between'}>
          <Box d="flex" flexDir="column" w={'99px'}>
            <Text
              {...STATER_STYLE.subTextBlack({
                colorMode,
                fontSize: 14,
              })}
              color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
              Token Name
            </Text>
            <Box d="flex" alignItems="baseline">
              <Text
                mr={1}
                {...STATER_STYLE.subTextBlack({
                  colorMode,
                  fontSize: 20,
                })}>
                {project.data.tokenName || 'NA'}
              </Text>
              <Text>{}</Text>
            </Box>
          </Box>
          <Box d="flex" flexDir="column" w={'99px'}>
            <Text
              {...STATER_STYLE.subTextBlack({
                colorMode,
                fontSize: 14,
              })}
              color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
              Token Symbol
            </Text>
            <Text
              mr={1}
              {...STATER_STYLE.mainText({
                colorMode,
                fontSize: 20,
              })}>
              {project.data.tokenSymbol ||'NA'}
            </Text>
          </Box>
          <Box d="flex" flexDir="column" w={'99px'}>
            <Text
              {...STATER_STYLE.subTextBlack({
                colorMode,
                fontSize: 14,
              })}
              color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
              Token Supply
            </Text>
            <Text
              mr={1}
              {...STATER_STYLE.mainText({
                colorMode,
                fontSize: 20,
              })}>
              {'NA'}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProjectCard;
