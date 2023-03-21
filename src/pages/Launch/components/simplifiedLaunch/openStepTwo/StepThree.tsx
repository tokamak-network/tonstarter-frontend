import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {ChevronDownIcon} from '@chakra-ui/icons';

const StepThree = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {MENU_STYLE} = theme;
  const [option, setOption] = useState('');
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

  return (
    <Flex
     
      flexDir={'column'}
      alignItems={'flex-start'}
      h='142px' 
     >
      <Text
        fontSize={'14px'}
        fontWeight={500}
        color={colorMode === 'dark' ? 'white.100' : 'gray.150'}
        mb="18px">
        What do you think is <span style={{color: '#2a72e5'}}> an appropriate price </span>for your coin when your
        project is past the growth phase and entering a <span style={{color: '#2a72e5'}}>stabilization phase,</span>
        given your project’s <span style={{color: '#2a72e5'}}>business model</span>?
      </Text>
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
            {option === '' ? 'Select One...' : option}
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
              <MenuItem key={index} onClick={() => setOption(price.toString())}>
                $ {price.toLocaleString()}
              </MenuItem>
            );
          })}
          <MenuItem color={'blue.300'} onClick={() => setOption('other')}>
            Other
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default StepThree;
