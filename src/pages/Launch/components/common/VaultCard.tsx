import {Box, Button, Flex, Text} from '@chakra-ui/react';
import {Projects, Vault} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useModal} from 'hooks/useModal';
import {useState} from 'react';

type VaultCardProps = {
  status: 'public' | 'notPublic';
  name: string;
  tokenAllocation: string;
  portion: string;
  isMandatory: boolean;
  adminAddress: string;
};

const VaultCard: React.FC<VaultCardProps> = (prop) => {
  const {status, name, tokenAllocation, portion, isMandatory, adminAddress} =
    prop;
  const [isHover, setIsHover] = useState<boolean>(false);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();

  function removeVault() {
    const vaultsList = values.vaults;
    setFieldValue(
      'vaults',
      vaultsList.filter((vault: Vault) => {
        return vault.vaultName !== name;
      }),
    );
  }
  const {openAnyModal} = useModal();

  return (
    <Flex
      w={'150px'}
      h={'172px'}
      flexDir={'column'}
      pl={'15px'}
      pt={'10px'}
      boxShadow={' 0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
      _hover={{
        bg: '#0070ed',
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}>
      <Flex mb={'15px'} justifyContent="space-between" pr={'12px'}>
        <Flex justifyContent={'space-between'} w={'100%'}>
          <Box
            w={'20px'}
            h={'20px'}
            fontSize={14}
            color="white.100"
            bg={status === 'public' ? '#0070ed' : '#26c1c9'}
            textAlign="center">
            {name.substring(0, 1)}
          </Box>
          <Button
            onClick={() =>
              openAnyModal('Launch_VaultBasicSetting', {
                name,
                tokenAllocation,
                adminAddress,
                isMandatory,
              })
            }>
            Edit
          </Button>
        </Flex>
        {isHover && !isMandatory && (
          <Box
            w={'16px'}
            h={'16px'}
            color={'white.100'}
            cursor="pointer"
            onClick={() => removeVault()}>
            X
          </Box>
        )}
      </Flex>
      <Text
        h={'26px'}
        mb={'10px'}
        fontSize={20}
        color={isHover ? 'white.100' : '#304156'}>
        {name}
      </Text>
      <Flex flexDir={'column'}>
        <Text h={'15px'} fontSize={11} color={isHover ? '#a8cbf8' : '#808992'}>
          Token Allocation
        </Text>
        <Text
          h={'20px'}
          fontSize={15}
          color={isHover ? 'white.100' : '#3d495d'}
          fontWeight={600}>
          {tokenAllocation}
        </Text>
      </Flex>
      <Flex flexDir={'column'}>
        <Text h={'15px'} fontSize={11} color={isHover ? '#a8cbf8' : '#808992'}>
          Portion
        </Text>
        <Text
          h={'20px'}
          fontSize={15}
          color={isHover ? 'white.100' : '#3d495d'}
          fontWeight={600}>
          {portion}
        </Text>
      </Flex>
    </Flex>
  );
};

export default VaultCard;
