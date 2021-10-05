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
  import { CustomInput } from 'components/Basic';
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
  };
  
  export const ClaimReward = () => {
    // const {data} = useAppSelector(selectModalType);
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {account, library} = useActiveWeb3React();
    const [claimableAmount, setClaimableAmount] = useState<Number>(100000.0);
    const [requestAmount, setRequestAmout] = useState<Number>(0);
    return (
      <Container>
        <Box
          border={themeDesign.border[colorMode]}
          h={'300px'}
          w={'400px'}
          p={'10px'} display={'flex'} flexDirection={'column'} alignItems={'center'} >
         <Box w={'100%'}>
          <Text fontWeight={'600'}>Claim</Text>
          <Flex justifyContent={'space-between'}>
            <Text>Reward Token</Text>
            <Select h={'32px'} color={'#86929d'} fontSize={'13px'} w={'140px'}>
              <option value="TOS">TOS</option>
              <option value="TON">TON</option>
              <option value="ETH">ETH</option>
            </Select>
          </Flex>
          <Flex justifyContent={'space-between'}>
            <Text>Claimable Amount</Text>
            <Text>
              {Number(claimableAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'}>
            <Text>Request Amount</Text>
            <Flex >
              <CustomInput value={requestAmount} setValue={setRequestAmout} w={'140px'}/>
                <Text>TOS</Text>
            </Flex>
          </Flex>
          </Box>
          <Button w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{backgroundColor: 'blue.100'}}>claim</Button>
        </Box>
      
      </Container>
    );
  };
  