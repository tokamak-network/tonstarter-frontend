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
import {Link, useRouteMatch} from 'react-router-dom';
//   import {TokenImage} from '@Admin/components/TokenImage';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {ProjectCardType} from '@Launch/types';
import {useEffect, useState} from 'react';
import {useCallContract} from 'hooks/useCallContract';
import {BigNumber} from 'ethers';
import {convertNumber} from 'utils/number';
import moment from 'moment';
const MobileProjectCard: React.FC<{
  project: any;
  index: number;
}> = (props) => {
  const {project, index} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {MOBILE_STATER_STYLE} = theme;
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
      const progressNow =
        (Number(convertedSum?.replaceAll(',', '')) /
          Number(project.data.vaults[0].hardCap)) *
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
      <Box {...MOBILE_STATER_STYLE.containerStyle({colorMode})} h={'194px'}>
        <Flex
          justifyContent="space-between"
          mb={'10px'}
          h={'40px'}>
          <Flex alignItems={'center'}>
            <Avatar
              src={project.data.tokenSymbolImage}
              backgroundColor={'transparent'}
              bg="transparent"
              color="#c7d1d8"
              name={'token_image'}
              border={colorMode === 'light' ? '1px solid #c7d1d8' : ''}
              borderRadius={25}
              h="40px"
              w="40px"
              mr={'12px'}
            />
            <Flex flexDir={'column'}>
              <Text
                h={'26px'}
                {...MOBILE_STATER_STYLE.mainText({colorMode})}
                fontFamily={theme.fonts.fld}>
                {project.data.projectName}
              </Text>
              <Flex>
          <Text
            {...{
              ...MOBILE_STATER_STYLE.subTextBlack({colorMode, fontSize: 12}),
            }}
            color={ 'gray.150' }
            mr={'4px'}
            fontSize={'12px'}>
            Sale Date:
          </Text>
          <Text
            {...{
              ...MOBILE_STATER_STYLE.mainText({colorMode, fontSize: 12}),
            }}
            fontSize={'12px'} color={colorMode === 'light'? 'gray.125': 'white.300'}>
            {moment
              .unix(project.data.vaults[0].publicRound1)
              .format('YYYY.MM.DD')}{' '}
            {`~`}{' '}
            {moment
              .unix(project.data.vaults[0].publicRound2)
              .format('MM.DD')}
            {/* {project.saleStart} - {project.saleEnd} */}
          </Text>
        </Flex>
            </Flex>
          </Flex>

          {/* <TokenImage imageLink={project.data.tokenSymbolImage}></TokenImage> */}

          <Text
            fontSize={'12px'}
            fontWeight="bold"
            mt={'6px'}
            color={
              started === 'Upcoming'
                ? '#2ea2f8'
                : started === 'Started'
                ? '#f95359'
                : '#86929d'
            }>
            {started}
          </Text>
        </Flex>

        <Box d="flex" flexDir="row" justifyContent="space-between" mb={'5px'}>
          <Flex alignItems="center" flexDirection={'row'}>
            <Text
              mr={1}
              {...MOBILE_STATER_STYLE.progress.mainText({
                colorMode,
                fontSize: 13,
              })}
              color={colorMode === 'light' ? 'gray.525' : 'white.300'}>
              Current
            </Text>
            <Text ml={'3px'} color={'blue.400'} fontSize={'13px'} fontWeight={600}>
              {progress === undefined ? 'XXX %' : progress + ' %'}
            </Text>
          </Flex>
          <Flex
            {...{
              ...MOBILE_STATER_STYLE.subTextBlack({colorMode, fontSize: 12}),
            }}
            color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
            <Text fontWeight={600} fontFamily={'Rajdhani'} mr={'2px'}>
              Current{' '}
            </Text>
            <Text fontWeight={500} fontFamily={'Rajdhani'}>
              {' '}
              / Minimum Fund Raising Amount
            </Text>
          </Flex>
        </Box>
        <Box mb={'25px'}>
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
              {...MOBILE_STATER_STYLE.subTextBlack({
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
                {...MOBILE_STATER_STYLE.subTextBlack({
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
              {...MOBILE_STATER_STYLE.subTextBlack({
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
              {...MOBILE_STATER_STYLE.mainText({
                colorMode,
                fontSize: 18,
              })}>
              {project.data.tokenSymbol || 'NA'}
            </Text>
          </Box>
          <Box d="flex" flexDir="column" w={'105px'}>
            <Text
              {...MOBILE_STATER_STYLE.subTextBlack({
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
              {...MOBILE_STATER_STYLE.mainText({
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

export default MobileProjectCard;
