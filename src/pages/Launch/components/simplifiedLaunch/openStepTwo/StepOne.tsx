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
import {Projects} from '@Launch/types';
import {VaultPublic} from '@Launch/types';
const StepOne = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [option, setOption] = useState('');
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

  const prices = [100000, 500000, 1000000];

  const handleSelect = (option: number) => {
    setOption(option.toString());
    setFieldValue('fundingTarget', option);
    setFieldValue('marketCap', option/0.3)
  };

  return (
    <Flex flexDir={'column'} h="142px" alignItems={'flex-start'}>
      <Text
        fontSize={'14px'}
        fontWeight={500}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        <span style={{color: '#2a72e5'}}>How much </span>
        do you want to raise?
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
              { option !== 'Other' && values.fundingTarget? ` $ ${values.fundingTarget.toLocaleString()}`: buttonStatus(option)}
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
                value={values.fundingTarget}
                onChange={(e) => {
                  
                  setFieldValue('fundingTarget', parseInt(e.target.value));
                  setFieldValue('marketCap', parseInt(e.target.value)/0.3)
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

export default StepOne;