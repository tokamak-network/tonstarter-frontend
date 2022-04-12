import {Box, Button, Flex, Image, Text} from '@chakra-ui/react';
import {Projects, Vault, VaultCommon} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useModal} from 'hooks/useModal';
import {useEffect, useMemo, useState} from 'react';
import PencilIcon from 'assets/launch/pen_inactive_icon.png';
import PencilActiveIcon from 'assets/launch/pen-active-icon.svg';
import {selectLaunch} from '@Launch/launch.reducer';
import {useAppSelector} from 'hooks/useRedux';
import HoverImage from 'components/HoverImage';
import commafy from 'utils/commafy';

type VaultCardProps = {
  status: 'public' | 'notPublic';
  name: string;
  tokenAllocation: string;
  isMandatory: boolean;
  adminAddress: string;
  vaultIndex: number;
};

const VaultCard: React.FC<VaultCardProps> = (prop) => {
  const {status, name, tokenAllocation, isMandatory, adminAddress, vaultIndex} =
    prop;
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const {
    data: {selectedVaultIndex},
  } = useAppSelector(selectLaunch);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  function removeVault() {
    setFieldValue(
      'vaults',
      vaultsList.filter((vault: Vault) => {
        return vault.index !== vaultIndex;
      }),
    );
  }
  const {openAnyModal} = useModal();

  useEffect(() => {
    if (selectedVaultIndex === vaultIndex) {
      return setIsSelected(true);
    }
    return setIsSelected(false);
  }, [vaultIndex, selectedVaultIndex]);

  useMemo(() => {
    const sumTotalToken = vaultsList.reduce((acc, cur) => {
      const {vaultTokenAllocation} = cur;
      return vaultTokenAllocation + acc;
    }, 0);
    setFieldValue('totalTokenAllocation', sumTotalToken);
    return sumTotalToken;
    /*eslint-disable*/
  }, [vaultsList]);

  return (
    <Flex
      w={'150px'}
      h={'196px'}
      flexDir={'column'}
      pl={'15px'}
      pt={'10px'}
      boxShadow={' 0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
      // _hover={{
      //   bg: '#0070ed',
      // }}
      bg={isSelected ? '#0070ed' : 'none'}
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

          <HoverImage
            img={PencilIcon}
            hoverImg={PencilActiveIcon}
            action={() =>
              openAnyModal('Launch_VaultBasicSetting', {
                name,
                tokenAllocation,
                adminAddress,
                isMandatory,
              })
            }></HoverImage>

          {/* <Image
            src={PencilIcon}
            alt={'vault_edit_button'}
            cursor="pointer"
            onClick={() =>
              openAnyModal('Launch_VaultBasicSetting', {
                name,
                tokenAllocation,
                adminAddress,
                isMandatory,
              })
            }></Image> */}
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
        h={'56px'}
        // mb={'10px'}
        fontSize={16}
        fontWeight={'bold'}
        color={isSelected ? 'white.100' : '#304156'}>
        {name}
      </Text>
      <Flex flexDir={'column'} mb={'8px'}>
        <Text
          h={'15px'}
          fontSize={11}
          color={isSelected ? '#a8cbf8' : '#808992'}>
          Token Allocation
        </Text>
        <Text
          h={'20px'}
          fontSize={15}
          color={isSelected ? 'white.100' : '#3d495d'}
          fontWeight={600}>
          {commafy(tokenAllocation)}
        </Text>
      </Flex>
      <Flex flexDir={'column'}>
        <Text
          h={'15px'}
          fontSize={11}
          color={isSelected ? '#a8cbf8' : '#808992'}>
          Portion
        </Text>
        <Text
          h={'20px'}
          fontSize={15}
          color={isSelected ? 'white.100' : '#3d495d'}
          fontWeight={600}>
          {(
            (Number(tokenAllocation.replaceAll(',', '')) * 100) /
            values.totalTokenAllocation
          )
            .toString()
            .match(/^\d+(?:\.\d{0,2})?/)}{' '}
          %
        </Text>
      </Flex>
    </Flex>
  );
};

export default VaultCard;
