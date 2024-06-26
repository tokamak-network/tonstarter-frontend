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
  Tooltip,
  Image,
  Button
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {ChevronDownIcon} from '@chakra-ui/icons';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {VaultPublic} from '@Launch/types';
import {fetchUsdPriceURL, fetchTonPriceURL} from 'constants/index';
import {fetchPoolPayload} from '@Launch/utils/fetchPoolPayload';
import {useActiveWeb3React} from 'hooks/useWeb3';
import truncNumber from 'utils/truncNumber';
import {schedules} from '@Launch/utils/simplifiedClaimSchedule';
import warning_circle_icon from 'assets/warning_circle_icon.png';

const StepOne = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [option, setOption] = useState('');
  const [tonInDollars, setTonInDollars] = useState(0);
  const [tonPriceInTos, setTonPriceInTos] = useState(0);
  const {account, library} = useActiveWeb3React();
  const [focus, setFocus] = useState(false);
  const {MENU_STYLE} = theme;
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
  
  //gets the TON price in $ and the TOS price in TON
  useEffect(() => {
    async function getTonPrice() {
      //fetch the price of ₩ in $
      const usdPriceObj = await fetch(fetchUsdPriceURL).then((res) => {
        if (!res.ok) {
          throw new Error('error in the api');
        }

        return res.json();
      }
      );
      //gets the price of TON in ₩
      const tonPriceObj = await fetch(fetchTonPriceURL).then((res) =>
      {
        if (!res.ok) {
          throw new Error('error in the api');
        }

        return res.json();
      }
      );

      // calculate the ton price in $
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

  const prices = [100000, 500000, 1000000];

  const handleSelect = (option: number) => {
    setOption(option.toString());
    handleInput(option);
  };

  //calculates and saves the hardCap, funcding target and the marketcap of the project
  const handleInput = (option: number) => {

    const fundingTarget = option;
    const marketCap = option / 0.3; //market cap is 30% of the funding target
    setFieldValue('fundingTarget', option);
    setFieldValue('marketCap', option / 0.3);


    if (values.totalSupply && values.stablePrice) {
      const totalSupply = values.totalSupply;
      const tokenPriceinDollars = values.stablePrice;
      const tokenPriceInTon = tokenPriceinDollars / tonInDollars;
      const tonPriceInToken = 1 / tokenPriceInTon;      

      const hardCap = (fundingTarget*0.5) / tonInDollars; //hardcap is half of the funding target in TON 
      
      setFieldValue(`vaults[0].hardCap`, hardCap ? truncNumber(hardCap, 2) : 0);
    }
  };

  return (
    <Flex flexDir={'column'} h="162px" alignItems={'flex-start'}>
      <Text
        fontFamily={theme.fonts.roboto}
        fontSize={'14px'}
        h="19px"
        fontWeight={'bold'}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        <span style={{color: '#2a72e5'}}>How much </span>
        do you want to raise?
      </Text>
      <Flex>
        <Menu>
          <MenuButton
           as={Button}
           isDisabled={values.vaults[0].isSet}
           _disabled={{
            bg: colorMode === 'dark' ? 'transparent' : '#e9edf1',
            color: colorMode === 'light' ? '#8f96a1' : '#484848',
            cursor: 'not-allowed',
            border:
              colorMode === 'light'
                ? '1px solid #dfe4ee'
                : '1px solid #323232',
               
          }}
            pl="15px"
            textAlign={'left'}
            fontSize={'13px'}
            border={
              colorMode === 'dark' ? '1px solid #424242' : '1px solid #dfe4ee'
            }
            borderRadius={'4px'}
            // border={themeDesign.border[colorMode]}
            {...MENU_STYLE.buttonStyle({colorMode})}
            w="115px"
            h="30px"
            bg={colorMode === 'dark' ? 'transparent' : '#ffffff'}>
            <Text {...MENU_STYLE.buttonTextStyle({colorMode})}>
              {option !== 'Other' && values.fundingTarget
                ? ` $ ${values.fundingTarget.toLocaleString()}`
                : buttonStatus(option)}
              <span>
                <ChevronDownIcon />
              </span>
            </Text>
          </MenuButton>
          <MenuList
            zIndex={10000}
            bg={colorMode === 'light' ? '#ffffff' : '#222222'}
            fontSize="13px"
            minWidth="115px">
            <MenuItem
              _hover={{color: '#2a72e5', bg: 'transparent'}}
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              onClick={() => setOption('')}>
              Select One...
            </MenuItem>
            {prices.map((price: number, index: number) => {
              return (
                <MenuItem
                  _hover={{color: '#2a72e5', bg: 'transparent'}}
                  color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
                  key={index}
                  onClick={() => handleSelect(price)}>
                  $ {price.toLocaleString()}
                </MenuItem>
              );
            })}
            <MenuItem
              _hover={{color: '#2a72e5', bg: 'transparent'}}
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              onClick={() => setOption('Other')}>
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
            // _active={{
            //   border: '1px solid #2a72e5'
            // }}

            _focus={{border: '1px solid #2a72e5'}}
            // focusBorderColor={'#2a72e5'}
            // focus={{outline: '1px solid #2a72e5'}}
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
                value={values.fundingTarget}
                onChange={(e) => {
                  handleInput(parseInt(e.target.value));
                }}
                textAlign={'left'}
                _focus={{}}></NumberInputField>
            </NumberInput>
          </Flex>
        ) : (
          <></>
        )}
      </Flex>
      <Text
        ml="10px"
        mt="12px"
        fontSize="12px"
        color={colorMode === 'light' ? '#7e7e8f' : '#9d9ea5'}>
        Minimum Funding Amount:
        <span
          style={{
            marginLeft: '4px',
            color: colorMode === 'light' ? '#353c48' : '#f3f4f1',
          }}>
          ${(values.fundingTarget?(values.fundingTarget* 0.5):0).toLocaleString()}
        </span>
        <span style={{
            marginLeft: '4px',
            fontWeight:'bold',
            color: colorMode === 'light' ? '#353c48' : '#f3f4f1',
          }}>({(values.fundingTarget?((values.fundingTarget* 0.5)/tonInDollars):0).toLocaleString()} TON)</span>
       
      </Text>
      <Text
        display="flex"
        w="230px"
        mb="20px"
        h="32px"
        ml="10px"
        mt="15px"
        fontSize="12px"
        color={colorMode === 'light' ? '#7e7e8f' : '#9d9ea5'}>
        If the raised funds don’t reach this amount, your funding will fail.{' '}
        <span
          style={{
            width: '24px',
            position: 'relative',
            top: '19px',
            right: '57px',
          }}>
          {' '}
          <Tooltip
            label={
              'The raised funds will be refunded while all project tokens issued are burned.'
            }
            bg="#353c48"
            hasArrow
            fontSize="12px"
            placement="top"
            w="250px"
            color={'#e6eaee'}
            aria-label={'Tooltip'}
            textAlign={'center'}
            size={'xs'}>
            <Image h="14px" w="14px" ml="3px" src={warning_circle_icon} />
          </Tooltip>
        </span>
      </Text>
    </Flex>
  );
};

export default StepOne;
