import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Select,
} from '@chakra-ui/react';

import {useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CustomInput} from 'components/Basic';
import {whiten} from '@chakra-ui/theme-tools';
import {PoolComponent} from './PoolComponent';
const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
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

export const ClaimReward = () => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<Number>(100000.0);
  const [requestAmount, setRequestAmout] = useState<Number>(0);
  return (
    <Flex justifyContent={'center'} >
    <Box w={'100%'} px={'15px'} >
      <Text
        fontWeight={'bold'}
        fontFamily={theme.fonts.titil}
        fontSize={'20px'}
        mb={'18px'}>
        Claim
      </Text>
      <Flex alignItems={'center'} h={'45px'}>
        <Text
          color={colorMode === 'light' ? '#808992' : '#949494'}
          fontWeight={'bold'}
          fontSize={'13px'}
          w={'134px'}>
           Reward Token
        </Text>
        <Select
          h={'30px'}
          color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
          fontSize={'12px'}
          w={'120px'}>
            <option value="TOS">TOS</option>
          <option value="TON">TON</option>
        <option value="ETH">ETH</option>

        </Select>
      </Flex>
      <Flex alignItems={'center'} h={'45px'}>
        <Text
          color={colorMode === 'light' ? '#808992' : '#949494'}
          fontWeight={'bold'}
          fontSize={'13px'}
          w={'134px'}>
        Claimable Amount
        </Text>
        <Box display={'flex'} alignItems={'baseline'}>
             <Text
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              fontWeight={'bold'}
              fontSize={'15px'}
              mr={'2px'}>
              {Number(claimableAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              fontWeight={'bold'}
              fontSize={'10px'}>
              TOS
            </Text>
          </Box>
      </Flex>
      <Flex alignItems={'center'} h={'45px'}>
        <Text
          color={colorMode === 'light' ? '#808992' : '#949494'}
          fontWeight={'bold'}
          fontSize={'13px'}
          w={'134px'}>
          Request Amount
        </Text>
        <Flex
            w={'120px'}
            alignItems={'center'}
            h={'30px'}
            border={themeDesign.border[colorMode]}
            borderRadius={'4px'}
            px={'10px'}>
            <CustomInput
              value={requestAmount}
              setValue={setRequestAmout}
              w={'100px'}
              fontSize={'13px'}
              h={'30px'}
              numberOnly={true}
            />
            <Text
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              fontWeight={'bold'}
              fontSize={'10px'}
              ml={'2px'}>
              TOS
            </Text>
          </Flex>
      </Flex>
      <Flex width={'100%'} justifyContent={'center'} borderBottom={themeDesign.borderDashed[colorMode]}>
      <Button
        w={'150px'}
        bg={'blue.500'}
        color="white.100"
        fontSize="14px"
        _hover={{backgroundColor: 'blue.100'}}
        mb={'40px'}
        mt={'20px'}
       >
        Claim
      </Button>
      </Flex>
    </Box>
  </Flex>
  );
};
