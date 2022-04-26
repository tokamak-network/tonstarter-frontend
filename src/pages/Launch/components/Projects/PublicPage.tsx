import {FC} from 'react';
import {
  Flex,
  Text,
  Grid,
  GridItem,
  useTheme,
  useColorMode,
  Button,
} from '@chakra-ui/react';

import {PublicPageTable} from './PublicPageTable';

import '../css/PublicPage.css';

type PublicPage = {};

export const PublicPage: FC<PublicPage> = ({}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const themeDesign = {
    border: {
      light: 'solid 1px #e7edf3',
      dark: 'solid 1px #535353',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  return (
    <Flex flexDirection={'column'}>
      <Grid templateColumns="repeat(3, 1fr)" w={'100%'}>
        <Flex flexDirection={'column'}>
          <GridItem className={'chart-cell'} fontSize={'16px'}>
            <Text>Token</Text>
            <Text>120,000,000 TON</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Public Round 1.</Text>
            <Text>6,000,000 TON (50%)</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Public Round 2.</Text>
            <Text>6,000,000 TON (50%)</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Token Allocation for Liquidiy Pool</Text>
            <Text>3,000,000 TON</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Hard Cap</Text>
            <Text>60,000,000 TON</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Addres for receiving funds</Text>
            <Text>0x1E0...8202</Text>{' '}
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Vault Admin Address</Text>
            <Text>0x1E0...8202</Text>{' '}
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Vault Contract Address</Text>
            <Text>0x1E0...8202</Text>{' '}
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem className={'chart-cell'} fontSize={'16px'}>
            <Text>Schedule</Text>
            <Text>KST</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Snapshot</Text>
            <Text>2021.12.14 17:00:00</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Whitelist</Text>
            <Text>2021.12.14 17:00:00</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Public Round 1.</Text>
            <Text>2021.12.14 17:00:00</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Public Round 2.</Text>
            <Text>2021.12.14 17:00:00</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>{''}</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>{''}</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>{''}</Text>
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem className={'chart-cell'} fontSize={'16px'}>
            <Text>sTOS Tier</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>Tier</Text>
            <Text>Required TOS</Text>
            <Text>Allocated Token</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>1</Text>
            <Text>1,000</Text>
            <Text>300,000 (50%)</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>2</Text>
            <Text>1,000</Text>
            <Text>300,000 (50%)</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>3</Text>
            <Text>1,000</Text>
            <Text>300,000 (50%)</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>4</Text>
            <Text>1,000</Text>
            <Text>300,000 (50%)</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>{''}</Text>
          </GridItem>
          <GridItem className={'chart-cell'}>
            <Text>{''}</Text>
          </GridItem>
        </Flex>
      </Grid>
      <Flex w={'100%'} justifyContent={'center'} py={'2rem'}>
        <Button
          className="button-style"
          background={'none'}
          px={'45px'}
          py={'10px'}
          // onClick={() => openAnyModal('Launch_Download', {})}
        >
          Download
        </Button>
      </Flex>
      <PublicPageTable />
    </Flex>
  );
};
