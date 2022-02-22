import {
  Box,
  Button,
  Flex,
  useColorMode,
  useTheme,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import Line from '@OpenCampagin/components/common/Line';
import StepTitle from '@OpenCampagin/components/common/StepTitle';
import arrowLeft from 'assets/svgs/arrow_left_normal_icon.svg';
import arrowRight from 'assets/svgs/arrow_right_normal_icon.svg';
import VaultCard from '../common/VaultCard';
import {useFormikContext} from 'formik';
import {useState} from 'react';
import {Vault} from '@OpenCampagin/types';

const Vaults = () => {
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const {values, setFieldValue} = useFormikContext();
  const [valutName, setVaultName] = useState<string>('');
  const [tokenAllocation, setTokenAllocation] = useState<string>('');
  //@ts-ignore
  const vaultsList = values.vaults;

  //   const [vaultsList, setVaultsList] = useState([]);

  console.log(vaultsList);

  return (
    <Flex
      {...OpenCampaginDesign.border({colorMode})}
      w={'600px'}
      h={'336px'}
      bg={'white.100'}
      flexDir="column">
      <Box h={'46px'} d="flex" alignItems={'center'} pl={'20px'}>
        <Box mr={'30px'}>
          <StepTitle title={'Small Title'} fontSize={16}></StepTitle>
        </Box>
        <Box mr={'7px'}>
          <Input
            placeHolder={'Vault Name'}
            w={'180px'}
            h={'32px'}
            fontSize={13}
            onChange={(e) => setVaultName(e.target.value)}
            inputStyle={{
              w: '180px',
              h: '32px',
            }}></Input>
        </Box>
        <Box mr={'7px'}>
          <Input
            w={'180px'}
            h={'32px'}
            placeHolder={'Token Allocation'}
            fontSize={13}
            onChange={(e) => setTokenAllocation(e.target.value)}
            inputStyle={{
              w: '180px',
              h: '32px',
            }}></Input>
        </Box>
        <Button
          w={'90px'}
          h={'32px'}
          bg={'none'}
          border={'solid 1px #2a72e5'}
          color={'#2a72e5'}
          fontSize={13}
          _hover={{}}
          onClick={() => {
            setFieldValue('vaults', [
              ...vaultsList,
              {
                vaultName: valutName,
                vaultTokenAllocation: tokenAllocation,
                firstClaimTime: new Date(),
                claimInterval: new Date(),
                claimRound: 0,
                adminAddress: '',
                isMandatory: false,
              },
            ]);
          }}>
          Add
        </Button>
      </Box>
      <Box>
        <Line></Line>
      </Box>
      <Box d="flex" h={'220px'} px={'15px'} justifyContent="space-between">
        <Image
          cursor={'pointer'}
          src={arrowLeft}
          w={'24px'}
          h={'48px'}
          alignSelf="center"
        />
        <Flex w={'520px'} alignItems="center" mx={'15px'}>
          {vaultsList?.map((vault: Vault, index: number) => {
            const {vaultName, vaultTokenAllocation, isMandatory} = vault;
            const strVaultTokenAllocation =
              vaultTokenAllocation?.toString() || '0';
            const portion = (vaultTokenAllocation || 0 / 1200000).toString();
            return (
              <Box mr={(index + 1) % 3 !== 0 ? '20px' : 0}>
                <VaultCard
                  key={`${vaultName}_${vaultTokenAllocation}`}
                  status={vaultName === 'Public' ? 'public' : 'notPublic'}
                  name={vaultName}
                  tokenAllocation={strVaultTokenAllocation}
                  portion={portion}
                  isMandatory={isMandatory}></VaultCard>
              </Box>
            );
          })}
        </Flex>
        <Image
          cursor={'pointer'}
          src={arrowRight}
          w={'24px'}
          h={'48px'}
          alignSelf="center"
        />
      </Box>
      <Box>
        <Line></Line>
      </Box>
      <Flex h="68px" pl={'20px'}>
        <Box
          d="flex"
          flexDir={'column'}
          h={'100%'}
          justifyContent="center"
          mr={'122px'}>
          <Text fontSize={13} color={'#808992'}>
            Title
          </Text>
          <Text fontSize={15} color={'#304156'} fontWeight={600}>
            10,000,000
          </Text>
        </Box>
        <Box
          d="flex"
          flexDir={'column'}
          h={'100%'}
          justifyContent="center"
          mr={'102px'}>
          <Text fontSize={13} color={'#808992'}>
            Title
          </Text>
          <Text fontSize={15} color={'#304156'} fontWeight={600}>
            10,000,000
          </Text>
        </Box>
        <Box d="flex" flexDir={'column'} h={'100%'} justifyContent="center">
          <Text fontSize={13} color={'#808992'}>
            Title
          </Text>
          <Text fontSize={15} color={'#304156'} fontWeight={600}>
            10,000,000
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Vaults;
