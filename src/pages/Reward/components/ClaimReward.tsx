import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
} from '@chakra-ui/react';

import {useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CustomInput} from 'components/Basic';
import { whiten } from '@chakra-ui/theme-tools';
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
    dark: 'dashed 1px #535353'
  }
};

export const ClaimReward = () => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<Number>(100000.0);
  const [requestAmount, setRequestAmout] = useState<Number>(0);
  return (
    <Box
      display={'flex'}
      flexDir={'column'}
      alignItems={'center'}
      boxShadow={'0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
      border={colorMode === 'light' ? '' : '1px solid #535353'}
      borderRadius={'15px'}
        bg={colorMode === 'light' ? '#FFFFFF' : ''}
        h={'830px'}
       w={'284px'}
       >
      <Box
       
       w={'284px'}
       p={'20px 15px'}
        >
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
            border={themeDesign.border[colorMode]}
            h={'31px'}
            color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
            fontSize={'12px'}
            w={'120px'}>
            <option value="TOS">TOS</option>
            <option value="TON">TON</option>
            <option value="ETH">ETH</option>
          </Select>
        </Flex>
        <Flex justifyContent={'space-between'} h={'45px'} alignItems={'center'}>
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
        <Flex justifyContent={'space-between'} h={'45px'} alignItems={'center'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            width={'185px'}>
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
      </Box>
      <Button
        display={'flex'}
        justifySelf={'center'}
        w={'150px'}
        bg={'blue.500'}
        color="white.100"
        fontSize="14px"
        _hover={{backgroundColor: 'blue.100'}}
        mb={'40px'}>
        Claim
      </Button>
      <Box px={'15px'} w={'100%'} mb={'10px'}>
      <Box borderTop={themeDesign.borderDashed[colorMode]} >
        <Text mt='30px' fontSize='20px' color={colorMode==='light'?'gray.250': 'white.100'} fontWeight='bold'>Pools</Text>
      </Box>
      </Box>
      <Box width='100%'>

      </Box>
     <Box>

     </Box>
    </Box>
  );
};
