import {
  Flex,
  Grid,
  GridItem,
  Tooltip,
  Box,
  useColorMode,
  useTheme,
  Text,
  Image,
} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import {ResponsivePie} from '@nivo/pie';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {simplifiedVaultsAny, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import truncNumber from 'utils/truncNumber';

const GraphComponent = () => {
  // const {vaults, totalTokenAlloc, totalSupply} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const colors = [
    '#2b66aa',
    '#f23c35',
    '#f7b729',
    '#5da344',
    '#f17235',
    '#fdb462',
    '#ffffb3',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd',
    '#ccebc5',
    '#ffed6f',
  ];

  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  // Allocation % for each vault.
  // initially allocated %
  const [vaultAllocations, setVaultAllocations] = useState({
    public: 30,
    team: 15,
    eco: 35,
    liquidity: 15,
    tonStarter: 5,
  });

  const calculateAllocated = (
    totalAllocation: number,
    vaultAllocation: number,
  ) => {
    const allocatedAmount = (vaultAllocation / totalAllocation) * 100;
    return allocatedAmount / 100;
  };
  const customVaults = values.vaults.filter(
    (vault: VaultAny) =>
      vault.isMandatory === false &&
      vault.vaultName !== 'Team' &&
      vault.vaultName !== 'Ecosystem',
  );

  const notAllocated = useMemo(() => {
    const vaults = values.vaults;
    const alloc = vaults.filter(
      (vault: VaultAny) =>
        vault.vaultName !== 'Vesting' && vault.vaultTokenAllocation === 0,
    );
    return alloc;
  }, [values.vaults]);

  const xx = useMemo(() => {
    const totalTokenAlloc = values.totalTokenAllocation;
    const vaults = values.vaults;

    const customTotal = calculateAllocated(
      totalTokenAlloc,
      customVaults.reduce((acc, vault) => acc + vault.vaultTokenAllocation, 0),
    );

    if (notAllocated.length === 0) {
      const publicAlloc = calculateAllocated(
        totalTokenAlloc,
        vaults[0].vaultTokenAllocation,
      );
      const liquidityAlloc = calculateAllocated(
        totalTokenAlloc,
        vaults[1].vaultTokenAllocation + vaults[6].vaultTokenAllocation,
      );
      const tonStarterAlloc = calculateAllocated(
        totalTokenAlloc,
        vaults[3].vaultTokenAllocation +
          vaults[4].vaultTokenAllocation +
          vaults[5].vaultTokenAllocation,
      );

      let teamAlloc = 0;
      let ecoAlloc = 0;
      let tokens = [];
      const teamVault = vaults.filter(
        (vault: VaultAny) => vault.vaultName === 'Team',
      );

      const ecoVault = vaults.filter(
        (vault: VaultAny) => vault.vaultName === 'Ecosystem',
      );
      teamAlloc = calculateAllocated(
        totalTokenAlloc,
        teamVault.length > 0 ? teamVault[0].vaultTokenAllocation : 0,
      );

      ecoAlloc = calculateAllocated(
        totalTokenAlloc,
        ecoVault.length > 0 ? ecoVault[0].vaultTokenAllocation : 0,
      );

      tokens.push(
        {name: 'Public', value: publicAlloc},
        {name: 'Liquidity', value: liquidityAlloc},
        {name: 'TONStarter', value: tonStarterAlloc},
        {name: 'Team', value: teamAlloc},
        {name: 'Ecosystem', value: ecoAlloc},
        {name: 'Custom', value: customTotal},
      );

      return tokens;
    } else {
      return [
        {name: 'Public', value: 0.3},
        {name: 'Liquidity', value: 0.15},
        {name: 'TONStarter', value: 0.05},
        {name: 'Team', value: 0.15},
        {name: 'Ecosystem', value: 0.35},
        {name: 'Custom', value: 0},
      ];
    }
  }, [values.totalTokenAllocation, values.vaults]);

  const data = xx
    .map((token: any) => {
      if (token.value !== 0) {
        return {
          id: token.name,
          label: token.name,
          value: token.value,
        };
      }
    })
    .filter((value) => value !== undefined);

  const formattedData = data.map((data: any, index: number) => {
    return {
      id: data.id,
      label: data.label,
      value: data.value,
      color: colors[index],
    };
  });

  return (
    <>
      <Flex mt="40px" w="100%" alignItems="center" flexDir={'column'}>
        <Text
          fontSize={'16px'}
          mb="21px"
          fontWeight={600}
          color={colorMode === 'dark' ? 'white.100' : 'gray.375'}>
          Token Distribution
        </Text>
        <Flex w={'331px'} h={'204px'}>
          <ResponsivePie
            data={formattedData}
            padAngle={0.7}
            cornerRadius={0}
            margin={{bottom: 4}}
            activeOuterRadiusOffset={0}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            colors={{datum: 'data.color'}}
            tooltip={({datum: data}) => (
              <div
                style={{
                  padding: 5,
                  background: '#222222',
                  color: '#fff',
                  borderRadius: '3px',
                }}>
                <div style={{display: 'flex'}}>
                  <p style={{marginRight: '5px'}}>{data.label}:</p>
                  <p style={{color: data.color}}>
                    {truncNumber(data.value * 100, 2)}%
                  </p>
                </div>
              </div>
            )}
            enableArcLinkLabels={false}
            enableArcLabels={false}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{from: 'color'}}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
            theme={{
              tooltip: {
                container: {
                  color: 'white',
                  background: 'black',
                },
              },
            }}
          />
        </Flex>
        <Grid
          templateRows="repeat(3, 1fr)"
          templateColumns="repeat(2, 1fr)"
          columnGap="20px"
          w="266px"
          mt="21px">
          {data.map((dataObj: any, index: number) => (
            <GridItem w="130px" h="18px" pl="10px" pr="13px" key={index}>
              <Flex alignItems={'center'}>
                <Flex
                  h="8px"
                  w="9.1px"
                  borderRadius={'50%'}
                  bg={colors[index]}
                  mr="8px"></Flex>
                <Flex
                  w="100%"
                  justifyContent={'space-between'}
                  fontSize="11px"
                  fontFamily="TitilliumWeb, sans-serif">
                  <Text
                    fontWeight={600}
                    color={colorMode === 'dark' ? '#f3f4f1' : '#3d495d'}
                    fontFamily="TitilliumWeb, sans-serif">
                    {dataObj.id}
                  </Text>
                  <Text
                    fontWeight={600}
                    color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                    fontFamily="TitilliumWeb, sans-serif">
                    {truncNumber(dataObj.value * 100, 2)}%
                  </Text>
                </Flex>
              </Flex>
            </GridItem>
          ))}
        </Grid>
        <Box
          mt="14px"
          mx="auto"
          w="100%"
          pl="20"
          fontSize="11px"
          display="flex"
          fontWeight={600}
          alignItems="center">
          <Text mr="6px" color="#7e8993" fontFamily="TitilliumWeb, sans-serif">
            * TONStarter section consists of three parts
          </Text>
          <Tooltip
            label={
              <>
                <div>1. WTON-TOS LP reward (2.5%)</div>
                <div>2. TON Staker (1.25%)</div>
                <div>3. TOS Staker (1.25%)</div>
              </>
            }
            color={colorMode === 'dark' ? '#ffffff' : '#ffffff'}
            fontSize="12px"
            hasArrow
            placement="bottom"
            colorScheme="gray"
            bg="#353c48">
            <Image src={tooltipIcon} />
          </Tooltip>
        </Box>
        {xx[xx.length - 1].name === 'Custom' &&
          xx[xx.length - 1].value !== 0 && (
            <Box
              mt="14px"
              mx="auto"
              w="100%"
              pl="20"
              fontSize="11px"
              display="flex"
              fontWeight={600}
              alignItems="center">
              <Text
                mr="6px"
                color="#7e8993"
                fontFamily="TitilliumWeb, sans-serif">
                * Custom section consists of these parts
              </Text>
              <Tooltip
                label={
                  <>
                    {customVaults.map((vault: VaultAny, index: number) => (
                      <div>
                        {index + 1}
                        {'.'}
                        {vault.vaultName} {' '}
                        ({(vault.vaultTokenAllocation /
                          values.totalTokenAllocation) *
                          100}%)
                      </div>
                    ))}
                  </>
                }
                color={colorMode === 'dark' ? '#ffffff' : '#ffffff'}
                fontSize="12px"
                hasArrow
                placement="bottom"
                colorScheme="gray"
                bg="#353c48">
                <Image src={tooltipIcon} />
              </Tooltip>
            </Box>
          )}
      </Flex>
    </>
  );
};

export default GraphComponent;
