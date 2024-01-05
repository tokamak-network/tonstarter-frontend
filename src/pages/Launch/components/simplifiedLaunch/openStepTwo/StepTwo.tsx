import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Menu,
  Button,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import {useEffect, useState, useMemo} from 'react';
import {ChevronDownIcon} from '@chakra-ui/icons';
import {useFormikContext} from 'formik';
import {Projects, VaultPublic} from '@Launch/types';
import {fetchUsdPriceURL, fetchTonPriceURL} from 'constants/index';
import {fetchPoolPayload} from '@Launch/utils/fetchPoolPayload';
import {useActiveWeb3React} from 'hooks/useWeb3';
import truncNumber from 'utils/truncNumber';
import {schedules} from '@Launch/utils/simplifiedClaimSchedule';

const StepTwo = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {MENU_STYLE} = theme;
  const [option, setOption] = useState({
    totalSupply: '',
    fundingPrice: '',
  });
  const [tonInDollars, setTonInDollars] = useState(0);
  const [tonPriceInTos, setTonPriceInTos] = useState(0);
  const {account, library} = useActiveWeb3React();
  const [focus, setFocus] = useState(false);
  const [fundPrice, setFundPrice] = useState(0);
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;

  //calculates the funding price needed for each total supply depending on the funding target and total supply
  const getPrices = useMemo(() => {
    const fundingTarget = values.fundingTarget;
    const totalSupply = [
      10000000, 100000000, 1000000000, 10000000000, 100000000000,
    ];
    const opts: any = totalSupply.map((amount: number, index: number) => {
      return {
        totalSupply: amount,
        fundingPrice: fundingTarget
          ? truncNumber(fundingTarget / (amount * 0.3), 6)
          : 0,
      };
    });

    return opts;
  }, [values.fundingTarget]);

  //same function as step one
  useEffect(() => {
    async function getTonPrice() {
      try {
        const usdPriceObj = await fetch(fetchUsdPriceURL).then((res) => {
          if (!res.ok) {
            throw new Error('error in the api');
          }

          return res.json();
        });
        const tonPriceObj = await fetch(fetchTonPriceURL).then((res) => {
          if (!res.ok) {
            throw new Error('error in the api');
          }

          return res.json();
        });

        const tonPriceKRW = tonPriceObj[0].trade_price;
        const krwInUsd = usdPriceObj.rates.USD;

        const tonPriceInUsd = tonPriceKRW * krwInUsd;
        setTonInDollars(tonPriceInUsd);
        const poolData = await fetchPoolPayload(library);

        const token0Price = Number(poolData.token0Price);

        setTonPriceInTos(token0Price);
      } catch (e) {
        console.log(e);
      }
    }
    getTonPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, values, option, fundPrice]);

  const buttonStatus = (option: any) => {
    switch (option.totalSupply) {
      case '':
        return 'Select One..';
      case 'Other':
        return 'Other';
      default:
        return `  ${Number(option.totalSupply).toLocaleString()} ${
          values.tokenSymbol
        } $ ${option.fundingPrice}/ ${values.tokenSymbol}`;
    }
  };

  const handleSelect = (option: any) => {
    setOption({
      totalSupply: option.totalSupply.toString(),
      fundingPrice: option.fundingPrice.toString(),
    });

    setFundPrice(option.fundingPrice);
    handleInput(option);
  };

  //depending on the total supply and the funding price set by the user, calculate project properties if the user selects option fro the 1st time 
  //or recalculate the the project properties if the user selects the option for the 2nd time and save to formik
  const handleInput = (opt: any) => {
    const totalSupply = opt.totalSupply;
    const fundingPrice = opt.fundingPrice;
    setFundPrice(opt.fundingPrice);
    setFieldValue('totalSupply', parseInt(opt.totalSupply));
    setFieldValue('stablePrice', fundingPrice);
    const marketCap = values.marketCap;

    if (marketCap) {
      const tokenPriceinDollars = fundingPrice;
      const tokenPriceInTon = tokenPriceinDollars / tonInDollars;
      const tonPriceInToken = 1 / tokenPriceInTon;
      setFieldValue('salePrice', truncNumber(tonPriceInToken, 2));
      setFieldValue('projectTokenPrice', truncNumber(tonPriceInToken, 2));
      const tokenPriceInTos = tokenPriceInTon * tonPriceInTos;
      const tosPriceInTokens = 1 / tokenPriceInTos;
      setFieldValue('tosPrice', truncNumber(tosPriceInTokens, 2));
      const hardCap =
        values.fundingTarget && (values.fundingTarget * 0.5) / tonInDollars;

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
      setFieldValue('vaults[1].tokenPair', `${values.tokenSymbol}-TOS`);
      setFieldValue('vaults[6].tokenPair', `${values.tokenSymbol}-TOS`);

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
      setFieldValue(
        'vaults[0].publicRound2Allocation',
        publicAllocation - public1All,
      );

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
  };

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

  return (
    <Flex flexDir={'column'} alignItems={'flex-start'} h="150px">
      <Text
        fontSize={'14px'}
        fontWeight={'bold'}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        Select your,{' '}
        <span style={{color: '#2a72e5'}}>
          Total Supply &amp; Token Funding Price
        </span>
      </Text>
      <Flex flexDir={'column'}>
        <Menu>
          <MenuButton
            as={Button}
            isDisabled={values.isTokenDeployed}
            pl="15px"
            textAlign={'left'}
            _hover={{}}
            _disabled={{
              bg: colorMode === 'dark' ? 'transparent' : '#e9edf1',
              color: colorMode === 'light' ? '#8f96a1' : '#484848',
              cursor: 'not-allowed',
              border:
                colorMode === 'light'
                  ? '1px solid #dfe4ee'
                  : '1px solid #323232',
                 
            }}
            _focus={{}}
            _active={[]}
            fontSize={'13px'}
            border={
              colorMode === 'dark' ? '1px solid #424242' : '1px solid #dfe4ee'
            }
            borderRadius={'4px'}
            {...MENU_STYLE.buttonStyle({colorMode})}
            w="264px"
            h="30px"
            bg={colorMode === 'dark' ? 'transparent' : '#ffffff'}>
            <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
              {option.totalSupply !== 'Other' &&
              values.totalSupply &&
              values.stablePrice
                ? ` ${values.totalSupply.toLocaleString()} ${
                    values.tokenSymbol
                  } $ ${values.stablePrice.toLocaleString(undefined, {
                    minimumFractionDigits: 6,
                  })}/ ${values.tokenSymbol}`
                : buttonStatus(option)}
              <span>
                {' '}
                <ChevronDownIcon />
              </span>
            </Text>
          </MenuButton>
          <MenuList
            isLazy
            zIndex={10000}
            bg={colorMode === 'light' ? '#ffffff' : '#222222'}
            fontSize="13px"
            minWidth="264px">
            <MenuItem
              _hover={{color: '#2a72e5', bg: 'transparent'}}
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              onClick={() => setOption({totalSupply: '', fundingPrice: ''})}>
              Select One...
            </MenuItem>
            {getPrices.map((price: any, index: number) => {
              return (
                <MenuItem
                  _hover={{color: '#2a72e5', bg: 'transparent'}}
                  color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
                  key={index}
                  onClick={() => handleSelect(price)}>
                  {`${price.totalSupply.toLocaleString()} ${
                    values.tokenSymbol
                  } $ ${price.fundingPrice}/ ${values.tokenSymbol}`}
                </MenuItem>
              );
            })}
            <MenuItem
              _hover={{color: '#2a72e5', bg: 'transparent'}}
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              onClick={() =>
                setOption({totalSupply: 'Other', fundingPrice: ''})
              }>
              Other
            </MenuItem>
          </MenuList>
        </Menu>
        {option.totalSupply === 'Other' ? (
          <Flex mt="9px" h="30px" alignItems={'center'}>
            <Flex
              h="30px"
              w="151px"
              alignItems={'center'}
              borderRadius="4px"
              bg={'transparent'}
              border={
                focus
                  ? '1px solid #2a72e5'
                  : colorMode === 'dark'
                  ? '1px solid #424242'
                  : '1px solid #dfe4ee'
              }
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
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
                  value={values.totalSupply?.toLocaleString()}
                  onChange={(e) => {
                    handleInput({
                      totalSupply: parseInt(e.target.value),
                      fundingPrice: values.fundingTarget
                        ? values.fundingTarget /
                          (parseInt(e.target.value) * 0.3)
                        : 0,
                    });
                  }}
                  textAlign={'right'}
                  _focus={{}}></NumberInputField>
              </NumberInput>
              <Text>{values.tokenSymbol}</Text>
            </Flex>
            <Text
              ml="9px"
              color={colorMode === 'dark' ? '#9d9ea5' : '#7e7e8f'}
              fontSize="13px">
              ${truncNumber(fundPrice, 5)}/{values.tokenSymbol}
            </Text>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
};

export default StepTwo;
