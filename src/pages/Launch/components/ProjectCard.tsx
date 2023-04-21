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
import moment from 'moment';
const ProjectCard: React.FC<{
  project: any;
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
  const [started, setStarted] = useState<string>('');
  const [totalRaise, setTotalRaise] = useState<string | undefined>(undefined);
  const [participants, setParticipants] = useState<string | undefined>(
    undefined,
  );
  const PUBLICSALE_CONTRACT = useCallContract(
    project.data.vaults[0].vaultAddress,
    'PUBLIC_SALE',
  );
  const now = moment().unix();

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
      console.log(convertedSum);
      console.log('project.data.vaults[0].vaultTokenAllocation',project.data.vaults[0].vaultTokenAllocation/project.data.salePrice);
      
      const progressNow =
        (Number(convertedSum?.replaceAll(',', '')) /
          Number(project.data.vaults[0].vaultTokenAllocation/project.data.salePrice)) *
        100;
      setTotalRaise(convertedSum);
      setProgress(Math.ceil(progressNow));
    }

    if (PUBLICSALE_CONTRACT && project) {
      fetchContractData();
    }
  }, [library, project, PUBLICSALE_CONTRACT]);

  useEffect(() => {
    const status =
      now < project.data.vaults[0].snapshot
        ? 'Upcoming'
        : now < project.data.vaults[0].publicRound2End
        ? 'Started'
        : 'Ended';

    setStarted(status);
  }, [now, project]);


  return (
    <Link to={`${url}/project/${project.key}`} id={`past_link_${index}`}>
      <Box {...STATER_STYLE.containerStyle({colorMode})} h={'285px'}>
        <Flex justifyContent="space-between" mb={'10px'}>
          <TokenImage imageLink={project.data.tokenSymbolImage}></TokenImage>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Box
              w={'7px'}
              h={'7px'}
              bg={
                started === 'Upcoming'
                  ? '#2ea2f8'
                  : started === 'Started'
                  ? '#f95359'
                  : '#e9edf1'
              }
              borderRadius={10}
              mr={'8px'}
            />
            <Text>{started}</Text>
          </Flex>
        </Flex>
        <Flex flexDir="column">
          <Text
            h={'36px'}
            {...STATER_STYLE.mainText({colorMode})}
            fontFamily={theme.fonts.fld}>
            {project.data.projectName}
          </Text>
        </Flex>
        <Flex mb={'15px'}>
          <Text
            {...{
              ...STATER_STYLE.subTextBlack({colorMode, fontSize: 12}),
            }}
            color={colorMode === 'light' ? 'gray.125' : 'gray.475'}
            mr={'8px'}
            fontSize={'14px'}>
            Sale Date:
          </Text>
          <Text
            {...{
              ...STATER_STYLE.mainText({colorMode, fontSize: 12}),
            }}
            fontSize={'14px'}>
            {/* {project.data.vaults[0].vaultName} */}
            {moment
              .unix(project.data.vaults[0].publicRound1)
              .format('YYYY.MM.DD')}{' '}
            {`~`}{' '}
            {moment
              .unix(project.data.vaults[0].publicRound2)
              .format('YYYY.MM.DD')}
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
            <Text fontWeight={600} fontFamily={'Rajdhani'} mr={'2px'}>Current </Text>
            <Text fontWeight={500}  fontFamily={'Rajdhani'}> / Funding Target</Text>
          </Flex>
        </Box>
        <Box mb={'30px'}>
          <Progress
            value={progress ? progress : 0}
            borderRadius={10}
            h={'6px'}
            bg={colorMode === 'light' ? '#e7edf3' : '#353d48'}
          />
        </Box>
        <Flex mb={'20px'} justifyContent={'space-between'}>
          <Box d="flex" flexDir="column" w={'99px'}>
            <Text
              {...STATER_STYLE.subTextBlack({
                colorMode,
                fontSize: 14,
              })}
              fontFamily={theme.fonts.fld}
              color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
              Token Name
            </Text>
            <Box d="flex" alignItems="baseline">
              <Text
                mr={1}
                fontFamily={theme.fonts.fld}
                {...STATER_STYLE.subTextBlack({
                  colorMode,
                  fontSize: 18,
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
              fontFamily={theme.fonts.fld}
              color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
              Token Symbol
            </Text>
            <Text
              mr={1}
              fontFamily={theme.fonts.fld}
              {...STATER_STYLE.mainText({
                colorMode,
                fontSize: 18,
              })}>
              {project.data.tokenSymbol || 'NA'}
            </Text>
          </Box>
          <Box d="flex" flexDir="column" w={'105px'}>
            <Text
              {...STATER_STYLE.subTextBlack({
                colorMode,
                fontSize: 14,
              })}
              fontFamily={theme.fonts.fld}
              color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
              Token Supply
            </Text>
            <Text
              mr={1}
              fontFamily={theme.fonts.fld}
              {...STATER_STYLE.mainText({
                colorMode,
                fontSize: 18,
              })}>
              {Number(project.data.totalSupply).toLocaleString(undefined, {
                minimumFractionDigits: 0,
              }) || 'NA'}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProjectCard;
