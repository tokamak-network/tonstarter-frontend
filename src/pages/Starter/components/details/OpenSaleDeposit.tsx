import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useState} from 'react';
import {DetailCounter} from './Detail_Counter';

export const OpenSaleDeposit = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const [inputBalance, setInputBalance] = useState(0);

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Open Sale
        </Text>
        <DetailCounter
          numberFontSize={'18px'}
          stringFontSize={'14px'}
          date={'2021-11-11'}></DetailCounter>
      </Box>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'10px'}>
        Deposited Amount
      </Text>
      <Box d="flex" alignItems="center" mb={'30px'}>
        <Box mr={'10px'}>
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={inputBalance}
            setValue={setInputBalance}></CustomInput>
        </Box>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 13})} mr={'3px'}>
          Your balance :{' '}
        </Text>
        <Text
          {...STATER_STYLE.mainText({colorMode, fontSize: 13})}
          color={'blue.100'}
          mr={'3px'}>
          33,000,354
        </Text>
        <Text
          {...STATER_STYLE.mainText({colorMode, fontSize: 13})}
          color={'blue.100'}>
          TON
        </Text>
      </Box>
      <Box d="flex" flexDir="column">
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
          Details
        </Text>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>2021.10.1 ~ 10.5</Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>2021.10.1 ~ 10.5</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>2021.10.1 ~ 10.5</Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>2021.10.1 ~ 10.5</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'46px'}>
        <CustomButton text={'Add whitelist'}></CustomButton>
      </Box>
    </Flex>
  );
};
