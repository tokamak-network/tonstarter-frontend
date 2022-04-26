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

type InitialLiquidity = {};

export const InitialLiquidity: FC<InitialLiquidity> = ({}) => {
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
    <Grid templateColumns="repeat(2, 1fr)" w={'100%'}>
      <Flex flexDirection={'column'}>
        <GridItem className={'chart-cell'} fontSize={'16px'}>
          <Text>Token</Text>
          <Text>120,000,000 TON</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>Price Range</Text>
          <Text>Full Range</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>Selected Pair</Text>
          <Text>Token Symbol - TOS</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>Pool Address</Text>
          <Text>0x1EO...8202</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>Vault Admin</Text>
          <Text>0x1EO...8202</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>Vault Contract Address</Text>
          <Text>0x1E0...8202</Text>{' '}
        </GridItem>
      </Flex>
      <Flex flexDirection={'column'}>
        <GridItem className={'chart-cell'} fontSize={'16px'}>
          <Text>LP Token</Text>
          <Text>ID #562734</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>LP Token</Text>
          <Text>Project Token</Text>
          <Text>TOS</Text>
          <Text>Action</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>Increase Liquidity</Text>
          <Text>10,000,000</Text>
          <Text>10,000,000</Text>
          <Button>Increase</Button>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>Unclaimed Fees</Text>
          <Text>10,000,000</Text>
          <Text>10,000,000</Text>
          <Button>Collect</Button>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>{''}</Text>
        </GridItem>
        <GridItem className={'chart-cell'}>
          <Text>{''}</Text>
        </GridItem>
      </Flex>
    </Grid>
  );
};
