import {Box, useColorMode, useTheme, Flex, Text, Input} from '@chakra-ui/react';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useEffect, useRef, useState} from 'react';
import {DetailCounter} from './Detail_Counter';
import ArrowIcon from 'assets/svgs/arrow_icon.svg';

export const ExclusiveSalePart = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const [inputBalance, setInputBalance] = useState(0);

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  const inputRef = useRef(null);

  useEffect(() => {
    console.log(inputRef);
  }, [inputRef]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Exclusive Sale
        </Text>
        <DetailCounter
          numberFontSize={'18px'}
          stringFontSize={'14px'}></DetailCounter>
      </Box>
      <Box d="flex">
        <Text
          {...STATER_STYLE.subText({colorMode})}
          letterSpacing={'1.4px'}
          color={'gray.375'}
          mb={'10px'}>
          Your Sale
        </Text>
        <Text
          {...STATER_STYLE.subText({colorMode})}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          (Your balance : 33,000,354 TON)
        </Text>
      </Box>
      <Box d="flex" alignItems="center" mb={'30px'}>
        <Box d="flex" mr={'10px'} alignItems="center">
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={inputBalance}
            setValue={setInputBalance}></CustomInput>
          <img
            src={ArrowIcon}
            alt={'icon_arrow'}
            style={{
              width: '20px',
              height: '20px',
              marginLeft: '20px',
              marginRight: '20px',
            }}></img>
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={inputBalance}
            setValue={setInputBalance}></CustomInput>
        </Box>
      </Box>
      <Box d="flex" flexDir="column" w={'400px'}>
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
        <CustomButton text={'Participate'}></CustomButton>
      </Box>
    </Flex>
  );
};
