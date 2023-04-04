import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {ChevronDownIcon} from '@chakra-ui/icons';
import {useFormikContext} from 'formik';
import {Projects,VaultPublic} from '@Launch/types';
import {fetchUsdPriceURL, fetchTonPriceURL} from 'constants/index';
import {fetchPoolPayload} from '@Launch/utils/fetchPoolPayload';
import {useActiveWeb3React} from 'hooks/useWeb3';
import truncNumber from 'utils/truncNumber';
import {schedules} from '@Launch/utils/simplifiedClaimSchedule';

const StepTwo = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {MENU_STYLE} = theme;
  const [option, setOption] = useState('');
  const [tonInDollars, setTonInDollars] = useState(0);
  const [tonPriceInTos, setTonPriceInTos] = useState(0);
  const {account, library} = useActiveWeb3React();

  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
    const {vaults} = values;
    const publicVault = vaults[0] as VaultPublic;



  const buttonStatus = (option: string) => {
    switch (option) {
      case '':
        return 'Select One..';
      case 'Other':
        return 'Other';
      default:
        return ` $ ${Number(option).toLocaleString()}`;
    }
  };

  useEffect(() => {
    async function getTonPrice() {
      const usdPriceObj = await fetch(fetchUsdPriceURL).then((res) =>
        res.json(),
      );
      const tonPriceObj = await fetch(fetchTonPriceURL).then((res) =>
        res.json(),
      );
      const tonPriceKRW = tonPriceObj[0].trade_price;
      const krwInUsd = usdPriceObj.rates.USD;

      const tonPriceInUsd = tonPriceKRW * krwInUsd;

      setTonInDollars(tonPriceInUsd);
      const poolData = await fetchPoolPayload(library);

      const token0Price = Number(poolData.token0Price);

      setTonPriceInTos(token0Price);
      // console.log(token0Price);
      // const tonPriceInTos =
    }
    getTonPrice();
  }, [library, values.vaults[0], option]);

  const handleSelect = (option: number) => {
    setOption(option.toString());
    handleInput(option);
   
  };
  const handleInput = (option: number) => {
    setFieldValue('growth', option);
    if (values.marketCap && values.totalSupply && values.stablePrice) {
      const growth = option;
      const stablePrice = values.stablePrice;
      const marketCap = values.marketCap
      const totalSupply = parseInt(
        ((marketCap * growth) / stablePrice).toString(),
      );   
      setFieldValue('totalSupply', totalSupply);
      const tokenPriceinDollars = marketCap / totalSupply;      
      const tokenPriceInTon = tokenPriceinDollars / tonInDollars;
      const tonPriceInToken = 1 / tokenPriceInTon;
      setFieldValue('salePrice', truncNumber(tonPriceInToken, 2));
      setFieldValue('projectTokenPrice', truncNumber(tonPriceInToken, 2));
      const tokenPriceInTos = tokenPriceInTon * tonPriceInTos;
      const tosPriceInTokens = 1 / tokenPriceInTos;
      setFieldValue('tosPrice', truncNumber(tosPriceInTokens, 2));
      const hardCap =
      values.fundingTarget && values.fundingTarget / tonInDollars;
    setFieldValue(`vaults[0].hardCap`, hardCap ? truncNumber(hardCap, 2) : 0);

    const publicAllocation = parseInt((totalSupply * 0.3).toString());

    const rounds = values.vaults.map((vault, index) => {
      const roundInfo = schedules(
        vault.vaultName,
        totalSupply,
        publicVault.publicRound2End ? publicVault.publicRound2End : 0,
      );

      const tot = roundInfo.reduce(
        (acc, round) => acc + round.claimTokenAllocation,
        0,
      );
      setFieldValue(`vaults[${index}].claim`, roundInfo);
      setFieldValue(`vaults[${index}].adminAddress`, account);
      setFieldValue(`vaults[${index}].vaultTokenAllocation`, tot);
      return tot;
    });
    setFieldValue('vaults[2].vaultTokenAllocation', 0);
      setFieldValue('vaults[0].addressForReceiving', account);
      setFieldValue('vaults[0].adminAddress', account);
      const tier1 = truncNumber(publicAllocation * 0.5 * 0.06, 0);
      const tier2 = truncNumber(publicAllocation * 0.5 * 0.12, 0);
      const tier3 = truncNumber(publicAllocation * 0.5 * 0.22, 0);
      const tier4 = truncNumber(publicAllocation * 0.5 * 0.6, 0);

      const public1All = tier1 + tier2 + tier3 + tier4;

      setFieldValue('vaults[0].stosTier.fourTier.allocatedToken', tier4);
      setFieldValue('vaults[0].stosTier.oneTier.allocatedToken', tier1);
      setFieldValue('vaults[0].stosTier.threeTier.allocatedToken', tier3);
      setFieldValue('vaults[0].stosTier.twoTier.allocatedToken', tier2);
      setFieldValue('vaults[0].publicRound1Allocation', public1All);
      setFieldValue('vaults[0].publicRound2Allocation',publicAllocation - public1All );
      
      setFieldValue(
        'vaults[1].startTime',
        publicVault.publicRound2End ? publicVault.publicRound2End + 1 : 0,
      );
      setFieldValue(
        'vaults[0].claimStart',
        publicVault.publicRound2End ? publicVault.publicRound2End + 1 : 0,
      );

      const mainVaults = rounds.splice(2, 1);

      const sumTotalToken = rounds.reduce((partialSum, a) => partialSum + a, 0);

      setFieldValue('totalTokenAllocation', sumTotalToken);
    }
  }

  const themeDesign = {
    border: {
      light: 'solid 1px #dfe4ee',
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
  };

  const prices = [10, 50, 100];
  return (
    <Flex flexDir={'column'} alignItems={'flex-start'} h="142px">
      <Text
        fontSize={'14px'}
        fontWeight={'bold'}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        Once your project has passed its growth phase and is stabilizing,{' '}
        <span style={{color: '#2a72e5'}}>how many times </span>its current value
        do you aim to grow to?
      </Text>
      <Flex>
        <Menu>
          <MenuButton
            pl="15px"
            textAlign={'left'}
            fontSize={'13px'}
            border={colorMode === 'dark'? '1px solid #424242':'1px solid #dfe4ee'}
            borderRadius={'4px'}
            {...MENU_STYLE.buttonStyle({colorMode})}
            w="115px"
            h="30px"
            bg={colorMode === 'dark' ? 'transparent' : '#ffffff'}>
            <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
              {option !== 'Other' && values.growth
                ? ` ${values.growth.toLocaleString()} times`
                : buttonStatus(option)}
              <span>
                {' '}
                <ChevronDownIcon />
              </span>
            </Text>
          </MenuButton>
          <MenuList
            zIndex={10000}
            bg={colorMode === 'light' ? '#ffffff' : '#222222'}
            fontSize="13px"
            minWidth="115px">
            <MenuItem _hover={{color: '#2a72e5', bg: 'transparent'}}
                  color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}  onClick={() => setOption('')}>Select One...</MenuItem>
            {prices.map((price: number, index: number) => {
              return (
                <MenuItem _hover={{color: '#2a72e5', bg: 'transparent'}}
                color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}  key={index} onClick={() => handleSelect(price)}>
                  {price.toLocaleString()} times
                </MenuItem>
              );
            })}
            <MenuItem _hover={{color: '#2a72e5', bg: 'transparent'}}
                  color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}   onClick={() => setOption('Other')}>
              Other
            </MenuItem>
          </MenuList>
        </Menu>
        {option === 'Other' ? (
          <Flex
            h="30px"
            w="130px"
            alignItems={'center'}
            borderRadius="4px"
            bg={ 'transparent'}
            border={
              colorMode === 'dark' ? '1px solid #424242' : '1px solid #dfe4ee'
            }
            focusBorderColor={'#dfe4ee'}
            pr="15px"
            fontSize={'13px'}>
            <NumberInput>
              <NumberInputField
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                  }
                }}
                h="30px"
                placeholder={'0'}
                fontSize={'13px'}
                border="none"
                onBlur={() => {}}
                pr="5px"
                step={0}
                value={values.growth}
                onChange={(e) => {
                   handleInput(parseInt(e.target.value))
                }}
                textAlign={'right'}
                _focus={{}}></NumberInputField>
            </NumberInput>
            <Text>times</Text>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
};

export default StepTwo;
