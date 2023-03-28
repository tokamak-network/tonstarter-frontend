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
import {fetchTonPriceURL} from 'constants/index';
import {fetchPoolPayload} from '@Launch/utils/fetchPoolPayload';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {schedules} from '@Launch/utils/simplifiedClaimSchedule';

const StepThree = (props: {currentStep: Number}) => {
  const {currentStep} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {MENU_STYLE} = theme;
  const [option, setOption] = useState('');
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const [tonInDollars, setTonInDollars] = useState(0);
  const [tonPriceInTos, setTonPriceInTos] = useState(0);
  const {account, library} = useActiveWeb3React();
  
  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;

  useEffect(() => {
    async function getTonPrice() {      
      const tonPriceObj = await fetch(fetchTonPriceURL).then((res) =>
        res.json(),
      );      
      const tonPrice = tonPriceObj[0].current_price;
      console.log('tonPrice',tonPrice);
      
      setTonInDollars(tonPrice);
      const poolData = await fetchPoolPayload(library);

      const token0Price = Number(poolData.token0Price);
      console.log('token0Price',token0Price);
      
      setTonPriceInTos(token0Price);
      // console.log(token0Price);
      // const tonPriceInTos =
    }
    getTonPrice();
  }, [library, values.vaults[0],option, currentStep]);

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

  const prices = [0.01, 0.1, 1];

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

  const handleSelect = (option: number) => {
    setOption(option.toString());
    handleInput(option);
  };

  const handleInput = (option: number) => {
    setFieldValue('stablePrice', option);
    const marketCap = values.marketCap;
    const growth = values.growth;
    if (marketCap && growth) {
      const totalSupply = (marketCap * growth) / option;
      setFieldValue('totalSupply', totalSupply);
      const tokenPriceinDollars = marketCap / totalSupply;      
      const tokenPriceInTon = tokenPriceinDollars / tonInDollars;
      const tonPriceInToken = 1/tokenPriceInTon
      setFieldValue('salePrice',tonPriceInToken )
      setFieldValue('projectTokenPrice',tonPriceInToken)
      const tokenPriceInTos = tokenPriceInTon * tonPriceInTos;
      const tosPriceInTokens = 1/tokenPriceInTos
    setFieldValue('tosPrice',tosPriceInTokens)

    const hardCap = values.fundingTarget && values.fundingTarget/tonInDollars;
   
    setFieldValue(`vaults[0].hardCap`, hardCap);
      
      const publicAllocation = totalSupply * 0.3;
      const initialLiquidityAllocation = totalSupply * 0.03;
      const tokenTOSAllocation = totalSupply * 0.12;

      const ecosystemAllocation = totalSupply * 0.35;
      const teamAllocation = totalSupply * 0.15;
      const tonStakerAllocation = totalSupply * 0.0125;
      const tosStakerAllocation = totalSupply * 0.0125;
      const wtonTosAllocation = totalSupply * 0.025;
      const rounds = values.vaults.map((vault, index) => {
        const roundInfo = schedules(vault.vaultName, totalSupply,publicVault.publicRound2End? publicVault.publicRound2End : 0);
        setFieldValue(`vaults[${index}].claim`, roundInfo);
        setFieldValue(`vaults[${index}].adminAddress`, account);

      });
      setFieldValue('vaults[0].addressForReceiving', account);
      setFieldValue('vaults[0].adminAddress', account);
      setFieldValue('vaults[0].vaultTokenAllocation', publicAllocation);
      setFieldValue(
        'vaults[1].vaultTokenAllocation',
        initialLiquidityAllocation,
      );
      // setFieldValue('vaults[2].vaultTokenAllocation', tokenTOSAllocation);
      setFieldValue('vaults[3].vaultTokenAllocation', tonStakerAllocation);
      setFieldValue('vaults[4].vaultTokenAllocation', tosStakerAllocation);
      setFieldValue('vaults[5].vaultTokenAllocation', wtonTosAllocation);
      setFieldValue('vaults[6].vaultTokenAllocation', tokenTOSAllocation);
      setFieldValue('vaults[7].vaultTokenAllocation', ecosystemAllocation);
      setFieldValue('vaults[8].vaultTokenAllocation', teamAllocation);
      setFieldValue('vaults[0].publicRound1Allocation', publicAllocation * 0.5);
      setFieldValue('vaults[0].publicRound2Allocation', publicAllocation * 0.5);
      setFieldValue('vaults[0].stosTier.fourTier.allocatedToken',publicAllocation * 0.5 * 0.6,);
      setFieldValue('vaults[0].stosTier.oneTier.allocatedToken', publicAllocation*0.5*0.06)
      setFieldValue('vaults[0].stosTier.threeTier.allocatedToken', publicAllocation*0.5*0.22)
      setFieldValue('vaults[0].stosTier.twoTier.allocatedToken', publicAllocation*0.5*0.12)
      setFieldValue('vaults[1].startTime', publicVault.publicRound2End?publicVault.publicRound2End+1:0)
      setFieldValue('vaults[0].claimStart', publicVault.publicRound2End?publicVault.publicRound2End+1:0)

      const sumTotalToken = vaults.reduce((acc, cur) => {
        const {vaultTokenAllocation} = cur;
        return vaultTokenAllocation + acc;
      }, 0);
      setFieldValue('totalTokenAllocation', sumTotalToken);
      
    }
  };

  return (
    <Flex flexDir={'column'} alignItems={'flex-start'} h="142px">
      <Text
        fontSize={'14px'}
        fontWeight={500}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        What do you think is{' '}
        <span style={{color: '#2a72e5'}}> an appropriate price </span>for your
        coin when your project is past the growth phase and entering a{' '}
        <span style={{color: '#2a72e5'}}>stabilization phase,</span>
        given your project’s{' '}
        <span style={{color: '#2a72e5'}}>business model</span>?
      </Text>
      <Flex>
        <Menu>
          <MenuButton
            pl="15px"
            textAlign={'left'}
            fontSize={'13px'}
            border={themeDesign.border[colorMode]}
            {...MENU_STYLE.buttonStyle({colorMode})}
            w="115px"
            h="30px"
            bg={colorMode === 'dark' ? 'transparent' : '#f9fafb'}>
            <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
              {option !== 'Other' && values.stablePrice
                ? ` $ ${values.stablePrice.toLocaleString()}`
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
            <MenuItem onClick={() => setOption('')}>Select One...</MenuItem>
            {prices.map((price: number, index: number) => {
              return (
                <MenuItem key={index} onClick={() => handleSelect(price)}>
                  $ {price.toLocaleString()}
                </MenuItem>
              );
            })}
            <MenuItem color={'blue.300'} onClick={() => setOption('Other')}>
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
            bg={colorMode === 'dark' ? 'transparent' : '#f9fafb'}
            border={
              colorMode === 'dark' ? '1px solid #323232' : '1px solid #dfe4ee'
            }
            focusBorderColor={'#dfe4ee'}
            pl="15px"
            fontSize={'13px'}>
            <Text>$</Text>
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
                // onBlur={() => {}}
                pl="5px"
                step={0}
                value={values.stablePrice}
                onChange={(e) => {
                  handleInput(parseInt(e.target.value));

                  //  setFieldValue('marketCap', parseInt(e.target.value)/0.3)
                }}
                textAlign={'left'}
                _focus={{}}></NumberInputField>
            </NumberInput>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
    </Flex>
  );
};

export default StepThree;
