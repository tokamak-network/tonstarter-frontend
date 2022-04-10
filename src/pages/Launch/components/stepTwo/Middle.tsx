import {Box, Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {Projects, Vault, VaultSchedule} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';
import {useModal} from 'hooks/useModal';
import {PublicProps} from '../common/VaultProps';
import {CustomButton} from 'components/Basic/CustomButton';
import TokenDetail from './TokenDetail';

const middleStyle = {
  border: 'solid 1px #eff1f6',
};

const Middle = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {data} = useAppSelector(selectLaunch);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const [tableData, setTableData] = useState<VaultSchedule[]>([]);

  const {selectedVaultDetail} = useVaultSelector();
  const {openAnyModal} = useModal();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData, selectedVault},
  } = useAppSelector(selectLaunch);

  function dispatchFormikSetValue() {
    // dispatch(
    //   saveTempVaultData({
    //     data: {},
    //   }),
    // );
    const vaultsList = values.vaults;

    const thisVaultValue = vaultsList.filter((vault: Vault) => {
      if (vault.vaultName === selectedVault) {
        return vault;
      }
    });
    const otherVaultValue = vaultsList.filter((vault: Vault) => {
      if (vault.vaultName !== selectedVault) {
        return vault;
      }
    });

    setFieldValue(
      'vaults',
      [
        ...otherVaultValue,
        {
          ...thisVaultValue[0],
          ...tempVaultData,
        },
      ].sort((a, b) => {
        return a.index > b.index ? 1 : b.index > a.index ? -1 : 0;
      }),
    );
  }

  useEffect(() => {
    if (selectedVaultDetail) {
      const {claim} = selectedVaultDetail;
      setTableData(claim);
      setIsEdit(false);
    }
  }, [selectedVaultDetail]);

  const isDisable = selectedVaultDetail?.vaultType !== 'Public';

  return (
    <Flex flexDir={'column'} w={'100%'}>
      <Box d={'flex'} mb={'15px'} justifyContent="space-between">
        <StepTitle title={'Token Detail'} fontSize={16}></StepTitle>
        {isEdit ? (
          <Flex>
            <CustomButton
              w={'100px'}
              h={'32px'}
              text={'Confirm'}
              style={{marginRight: '10px'}}
              func={() => {
                setIsEdit(false);
                dispatchFormikSetValue();
              }}></CustomButton>
            <CustomButton
              w={'100px'}
              h={'32px'}
              text={'Cancel'}
              func={() => {
                setIsEdit(false);
                dispatch(
                  saveTempVaultData({
                    data: {},
                  }),
                );
              }}></CustomButton>
          </Flex>
        ) : (
          <CustomButton
            w={'100px'}
            h={'32px'}
            text={'Edit'}
            isDisabled={isDisable}
            func={() => setIsEdit(true)}></CustomButton>
        )}
      </Box>
      <Flex>
        <TokenDetail isEdit={isEdit}></TokenDetail>
      </Flex>
      {/* <Flex>
        <Box
          d="flex"
          flexDir={'column'}
          textAlign="center"
          border={middleStyle.border}
          lineHeight={'42px'}>
          <Flex
            h={'42px'}
            fontSize={12}
            color={'#3d495d'}
            fontWeight={600}
            borderBottom={middleStyle.border}>
            <Text w={'197px'}>Claim</Text>
            <Text w={'197px'} borderX={middleStyle.border}>
              Token Allocation
            </Text>
            <Text w={'144px'}>Accumulated</Text>
          </Flex>
          
          {tableData.map((data: any, index: number) => {
            const {claimTime, claimTokenAllocation} = data;
            return (
              <Flex
                h={'42px'}
                pos={'relative'}
                fontSize={13}
                color={'#3d495d'}
                bg={index % 2 === 0 ? '#fafbfc' : 'none'}>
                <Box d="flex" w={'197px'} justifyContent="center">
                  <Text mr={'2px'}>{`0${index + 1}`}</Text>
                  <Text fontSize={12} color={'#808992'}>
                    {moment.unix(claimTime).format('MM.DD.YYYY hh:mm:ss')}
                  </Text>
                </Box>
                <Text w={'197px'} borderX={middleStyle.border}>
                  {claimTokenAllocation}
                </Text>
                <Text w={'144px'}>{'1%'}</Text>
                <Button
                  pos={'absolute'}
                  left={-75}
                  onClick={() =>
                    setTableData([
                      ...tableData,
                      {
                        claimRound: tableData.length + 1,
                        claimTime: 1647240920,
                        claimTokenAllocation: 0,
                      },
                    ])
                  }>
                  add
                </Button>
              </Flex>
            );
          })}
        </Box>
      </Flex> */}
    </Flex>
  );
};

export default Middle;
