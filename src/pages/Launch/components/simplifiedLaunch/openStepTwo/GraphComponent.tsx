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
    return allocatedAmount/100;
  };

  // useEffect(() => {

  //   const totalTokenAlloc = values.totalTokenAllocation
  //   const vaults = values.vaults
  //   if (totalTokenAlloc) {
  //     const publicAlloc = calculateAllocated(totalTokenAlloc, vaults[0]?.vaultTokenAllocation? vaults[0].vaultTokenAllocation: 0);
  //     const teamAlloc = calculateAllocated(totalTokenAlloc, vaults[8]?.vaultTokenAllocation? vaults[8].vaultTokenAllocation: 0 );
  //     const ecoAlloc = calculateAllocated(totalTokenAlloc, vaults[7]?.vaultTokenAllocation? vaults[7].vaultTokenAllocation: 0);
  //     const liquidityAlloc = calculateAllocated(totalTokenAlloc, vaults[1]?.vaultTokenAllocation && vaults[6]?.vaultTokenAllocation ? vaults[1].vaultTokenAllocation + vaults[6].vaultTokenAllocation: 0);
  //     const tonStarterAlloc = calculateAllocated(totalTokenAlloc,vaults[3]?.vaultTokenAllocation && vaults[4]?.vaultTokenAllocation && vaults[5]?.vaultTokenAllocation?  vaults[3].vaultTokenAllocation + vaults[4].vaultTokenAllocation + vaults[5].vaultTokenAllocation: 0);

  //     setVaultAllocations({
  //       public: publicAlloc,
  //       team: teamAlloc,
  //       eco: ecoAlloc,
  //       liquidity: liquidityAlloc,
  //       tonStarter: tonStarterAlloc
  //     });
  //   }
  // }, [values]);
  console.log(values);

  const xx = useMemo(() => {
    const totalTokenAlloc = values.totalTokenAllocation;
    const vaults = values.vaults;
    const customVaults = vaults.slice(9, vaults.length);

    const customTotal = calculateAllocated(
      totalTokenAlloc,
      customVaults.reduce((acc, vault) => acc + vault.vaultTokenAllocation, 0),
    );

    const notAllocated = vaults.filter(
      (vault: VaultAny) => vault.vaultTokenAllocation === undefined,
    );

    if (notAllocated.length === 0) {
      const publicAlloc = calculateAllocated(
        totalTokenAlloc,
        vaults[0].vaultTokenAllocation,
      );
      const teamAlloc = calculateAllocated(
        totalTokenAlloc,
        vaults[8].vaultTokenAllocation,
      );
      const ecoAlloc = calculateAllocated(
        totalTokenAlloc,
        vaults[7].vaultTokenAllocation,
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
      return {
        public: publicAlloc,
        team: teamAlloc,
        eco: ecoAlloc,
        liquidity: liquidityAlloc,
        tonStarter: tonStarterAlloc,
        custom: customTotal,
      };
    } else {
      return {
        public: 30,
        team: 15,
        eco: 35,
        liquidity: 15,
        tonStarter: 5,
        custom: 0,
      };
    }
  }, [values.totalTokenAllocation, values.vaults]);

  const data = [
    {
      id: 'public',
      label: 'Public',
      value: truncNumber(xx.public,2),
    },
    {
      id: 'ecosystem',
      label: 'Ecosystem',
      value: truncNumber(xx.eco,3),
    },
    {
      id: 'team',
      label: 'Team',
      value: xx.team ,
    },
    {
      id: 'liquidity',
      label: 'Liquidity',
      value: xx.liquidity,
    },
    {
      id: 'tonstarter',
      label: 'TONStarter',
      value: xx.tonStarter,
    },
    {
      id: 'custom',
      label: 'custom',
      value: xx.custom ,
    },
  ];

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
            activeOuterRadiusOffset={3}
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
                  <p style={{color: data.color}}>{data.value * 100}%</p>
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
          <GridItem w="123px" h="18px" pl="10px" pr="13px">
            <Flex alignItems={'center'}>
              <Flex
                h="8px"
                w="9.1px"
                borderRadius={'50%'}
                bg={'#2b66aa'}
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
                  Public
                </Text>
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                  fontFamily="TitilliumWeb, sans-serif">
                  {xx.public*100}%
                </Text>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem w="123px" h="18px" pl="10px" pr="13px">
            <Flex alignItems={'center'}>
              <Flex
                h="8px"
                w="9.1px"
                borderRadius={'50%'}
                bg={'#f23c35'}
                mr="8px"
                justifyContent="flex-end"></Flex>
              <Flex
                w="100%"
                justifyContent={'space-between'}
                fontSize="11px"
                fontFamily="TitilliumWeb, sans-serif">
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#f3f4f1' : '#3d495d'}
                  fontFamily="TitilliumWeb, sans-serif">
                  Ecosystem
                </Text>
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                  fontFamily="TitilliumWeb, sans-serif">
                  {truncNumber(xx.eco*100,2)}%
                </Text>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem w="123px" h="18px" pl="10px" pr="13px">
            <Flex alignItems={'center'}>
              <Flex
                h="8px"
                w="9.1px"
                borderRadius={'50%'}
                bg={'#f7b729'}
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
                  Team
                </Text>
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                  fontFamily="TitilliumWeb, sans-serif">
                  {xx.team*100}%
                </Text>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem w="123px" h="18px" pl="10px" pr="13px">
            <Flex alignItems={'center'}>
              <Flex
                h="8px"
                w="9.1px"
                borderRadius={'50%'}
                bg={'#5da344'}
                mr="8px"></Flex>
              <Flex w="100%" justifyContent={'space-between'} fontSize="11px">
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#f3f4f1' : '#3d495d'}
                  fontFamily="TitilliumWeb, sans-serif">
                  Liquidity
                </Text>
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                  fontFamily="TitilliumWeb, sans-serif">
                  {xx.liquidity*100}%
                </Text>
              </Flex>
            </Flex>
          </GridItem>
          <GridItem w="123px" h="18px" pl="10px" pr="13px">
            <Flex alignItems={'center'}>
              <Flex
                h="8px"
                w="9.1px"
                borderRadius={'50%'}
                bg={'#f17235'}
                mr="8px"></Flex>
              <Flex w="100%" justifyContent={'space-between'} fontSize="11px">
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#f3f4f1' : '#3d495d'}
                  fontFamily="TitilliumWeb, sans-serif">
                  TONStarter
                </Text>
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                  fontFamily="TitilliumWeb, sans-serif">
                  {truncNumber(xx.tonStarter*100,1)}%
                </Text>
              </Flex>
            </Flex>
          </GridItem>
          {xx.custom > 0 &&   <GridItem w="133px" h="18px" pl="10px" pr="13px">
            <Flex alignItems={'center'}>
              <Flex
                h="8px"
                w="9.1px"
                borderRadius={'50%'}
                bg={'#fdb462'}
                mr="8px"></Flex>
              <Flex w="100%" justifyContent={'space-between'} fontSize="11px">
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#f3f4f1' : '#3d495d'}
                  fontFamily="TitilliumWeb, sans-serif">
                  Custom
                </Text>
                <Text
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#7e8993'}
                  fontFamily="TitilliumWeb, sans-serif">
                  {truncNumber(xx.custom*100,1)}%
                </Text>
              </Flex>
            </Flex>
          </GridItem>}
          {}
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
      </Flex>
    </>
  );
};

export default GraphComponent;
