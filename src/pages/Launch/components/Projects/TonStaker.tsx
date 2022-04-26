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

type TonStaker = {};

export const TonStaker: FC<TonStaker> = ({}) => {
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
    <Flex flexDirection={'column'} w={'1030px'} p={'0px'}>
      <Grid templateColumns="repeat(2, 1fr)" w={'100%'}>
        <Flex flexDirection={'column'}>
          <GridItem
            className={'chart-cell'}
            borderRight={'none'}
            borderTopLeftRadius={'4px'}
            borderBottom={'none'}
            fontSize={'16px'}
            fontFamily={theme.fonts.fld}>
            <Text
              fontSize={'15px'}
              fontWeight={'bolder'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              Token
            </Text>
            <Text>120,000,000 TON</Text>
          </GridItem>
          <GridItem
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderRight={'none'}
            borderBottom={'none'}>
            <Text
              fontSize={'13px'}
              w={'66px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Vault Admin Address
            </Text>
            <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              0x1E0…8202
            </Text>
          </GridItem>
          <GridItem
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottomLeftRadius={'4px'}
            borderRight={'none'}>
            <Text
              w={'81px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              Vault Contract Address
            </Text>
            <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              0x1E0…8202
            </Text>
          </GridItem>
        </Flex>
        <Flex flexDirection={'column'}>
          <GridItem
            className={'chart-cell'}
            fontSize={'16px'}
            fontFamily={theme.fonts.fld}
            borderTopEndRadius={'4px'}
            borderBottom={'none'}>
            <Text
              fontSize={'15px'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              Distribute
            </Text>
          </GridItem>
          <GridItem
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottom={'none'}>
            <Flex alignItems={'baseline'} fontWeight={'bold'}>
              {' '}
              <Text
                mr={'3px'}
                fontSize={'20px'}
                color={colorMode === 'light' ? '#353c48' : 'white.0'}>
                10,000,000
              </Text>{' '}
              <Text
                color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
                fontSize={'13px'}>
                TON
              </Text>
            </Flex>

            <Button
              fontSize={'13px'}
              w={'100px'}
              h={'32px'}
              bg={'#257eee'}
              disabled={true}
              color={'#ffffff'}
              _disabled={{
                color: colorMode === 'light' ? '#86929d' : '#838383',
                bg: colorMode === 'light' ? '#e9edf1' : '#353535',
              }}>
              Distribute
            </Button>
          </GridItem>
          <GridItem
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            borderBottomRightRadius={'4px'}>
            <Flex flexDir={'column'}>
              <Text color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}>
                You can distribute on
              </Text>
              <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
                Mar.31, 2022 21:00:00 (KST)
              </Text>
            </Flex>
            <Button
              fontSize={'13px'}
              w={'100px'}
              h={'32px'}
              bg={'#257eee'}
              disabled={false}
              color={'#ffffff'}
              _disabled={{
                color: colorMode === 'light' ? '#86929d' : '#838383',
                bg: colorMode === 'light' ? '#e9edf1' : '#353535',
              }}>
              Distribute
            </Button>
          </GridItem>
        </Flex>
      </Grid>
    </Flex>
  );
};
