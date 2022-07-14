import {Box, Flex, Text, useColorMode} from '@chakra-ui/react';
import {Projects, Vault} from '@Launch/types';
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
    data: {selectedVaultIndex, uncompletedVaultIndex, alreadySelected},
  } = useAppSelector(selectLaunch);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;

  const {openAnyModal} = useModal();
  const {colorMode} = useColorMode();

  const [thisVaultUncompleted, setThisVaultUncompleted] =
    useState<boolean>(false);

  function removeVault() {
    setFieldValue(
      'vaults',
      vaultsList.filter((vault: Vault) => {
        return vault.index !== vaultIndex;
      }),
    );
  }

  useEffect(() => {
    uncompletedVaultIndex?.fileds?.map((vaultUncompleted, index) => {
      console.log('--');
      console.log(vaultUncompleted);

      if (
        vaultUncompleted.length > 0 &&
        index === vaultIndex &&
        alreadySelected &&
        alreadySelected.indexOf(index) !== -1 &&
        alreadySelected[alreadySelected.length - 1] !== index
      ) {
        return setThisVaultUncompleted(true);
      }
    });
  }, [uncompletedVaultIndex, vaultIndex, alreadySelected]);

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
      border={
        isHover
          ? '1px solid #0070ed'
          : colorMode === 'light'
          ? ''
          : '1px solid #373737'
      }
      borderRadius={colorMode === 'light' ? '' : '4px'}
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
            {name?.substring(0, 1)}
          </Box>
          <HoverImage
            img={PencilIcon}
            hoverImg={PencilIcon}
            action={() =>
              openAnyModal('Launch_VaultBasicSetting', {
                name,
                tokenAllocation,
                adminAddress,
                isMandatory,
                vaultIndex,
              })
            }></HoverImage>
        </Flex>
        {isHover && !isMandatory && isSelected && (
          <Box
            ml={'10px'}
            w={'16px'}
            h={'16px'}
            color={'white.100'}
            cursor="pointer"
            onClick={() => {
              if (window.confirm('Do you really want to remove this vault?')) {
                removeVault();
              }
            }}>
            X
          </Box>
        )}
      </Flex>
      <Flex>
        {isMandatory && (
          <Text mr={'5px'} color={isSelected ? '#ffffff' : '#ff3b3b'}>
            *
          </Text>
        )}
        <Text
          h={'56px'}
          // mb={'10px'}
          fontSize={16}
          fontWeight={'bold'}
          color={
            thisVaultUncompleted && isSelected
              ? 'white.100'
              : thisVaultUncompleted
              ? '#ff3b3b'
              : isSelected
              ? 'white.100'
              : colorMode === 'light'
              ? '#304156'
              : 'white.100'
          }>
          {name}
        </Text>
      </Flex>
      {thisVaultUncompleted ? (
        <>
          <Flex flexDir={'column'} mb={'25px'} fontSize={11}>
            <Text h={'13px'} color={isSelected ? '#a8cbf8' : '#ff3b3b'}>
              The information
            </Text>
            <Text h={'13px'} color={isSelected ? 'white.100' : '#ff3b3b'}>
              you entered is incorrect.
            </Text>
          </Flex>
          <Flex flexDir={'column'} fontSize={11}>
            <Text h={'13px'} color={isSelected ? '#a8cbf8' : '#ff3b3b'}>
              Please check
            </Text>
            <Text h={'13px'} color={isSelected ? 'white.100' : '#ff3b3b'}>
              the Token, Tier info
            </Text>
          </Flex>
        </>
      ) : (
        <>
          <Flex flexDir={'column'} mb={'8px'}>
            <Text
              h={'15px'}
              fontSize={11}
              color={
                isSelected
                  ? '#a8cbf8'
                  : colorMode === 'light'
                  ? '#808992'
                  : '#9d9ea5'
              }>
              Token Allocation
            </Text>
            <Text
              h={'20px'}
              fontSize={15}
              color={
                isSelected
                  ? 'white.100'
                  : colorMode === 'light'
                  ? '#3d495d'
                  : 'white.100'
              }
              fontWeight={600}>
              {commafy(tokenAllocation)}
            </Text>
          </Flex>
          <Flex flexDir={'column'}>
            <Text
              h={'15px'}
              fontSize={11}
              color={
                isSelected
                  ? '#a8cbf8'
                  : colorMode === 'light'
                  ? '#808992'
                  : '#9d9ea5'
              }>
              Portion
            </Text>
            <Text
              h={'20px'}
              fontSize={15}
              color={
                isSelected
                  ? 'white.100'
                  : colorMode === 'light'
                  ? '#3d495d'
                  : 'white.100'
              }
              fontWeight={600}>
              {(
                (Number(tokenAllocation.replaceAll(',', '')) * 100) /
                values.totalSupply!
              )
                .toString()
                .match(/^\d+(?:\.\d{0,2})?/)}{' '}
              %
            </Text>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default VaultCard;
