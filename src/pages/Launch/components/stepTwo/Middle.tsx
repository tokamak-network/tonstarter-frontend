import {Box, Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {Projects, Vault, VaultSchedule} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';
import {CustomButton} from 'components/Basic/CustomButton';
import TokenDetail from './TokenDetail';

type MiddleProps = {
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const Middle: React.FC<MiddleProps> = (props) => {
  const {isEdit, setIsEdit} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [tableData, setTableData] = useState<VaultSchedule[]>([]);

  const {selectedVaultDetail} = useVaultSelector();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData, selectedVault},
  } = useAppSelector(selectLaunch);

  function dispatchFormikSetValue() {
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

    if ('tosPrice' in tempVaultData) {
      //@ts-ignore
      setFieldValue('tosPrice', tempVaultData.tosPrice);
      setFieldValue(
        'vaults',
        [
          ...otherVaultValue,
          {
            ...thisVaultValue[0],
            ...(tempVaultData as Object),
          },
        ].sort((a, b) => {
          return a.index > b.index ? 1 : b.index > a.index ? -1 : 0;
        }),
      );
    } else {
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
  }

  useEffect(() => {
    if (selectedVaultDetail) {
      const {claim} = selectedVaultDetail;
      setTableData(claim);
      setIsEdit(false);
    }
  }, [selectedVaultDetail]);

  const isDisable =
    selectedVaultDetail?.vaultTokenAllocation === 0 ||
    selectedVaultDetail?.index === 5 ||
    selectedVaultDetail?.index === 6 ||
    (selectedVaultDetail?.vaultType !== 'Public' &&
      selectedVaultDetail?.vaultType !== 'Liquidity Incentive' &&
      selectedVaultDetail?.vaultType !== 'Initial Liquidity');

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
              isDisabled={isConfirm}
              func={() => {
                setIsEdit(false);
                dispatchFormikSetValue();
              }}></CustomButton>
            <CustomButton
              w={'100px'}
              h={'32px'}
              text={'Cancel'}
              style={{
                bg: colorMode === 'light' ? '#e9edf1' : '#353535',
                color: colorMode === 'light' ? '#3a495f' : '#f3f4f1',
              }}
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
        <TokenDetail isEdit={isEdit} setIsConfirm={setIsConfirm}></TokenDetail>
      </Flex>
    </Flex>
  );
};

export default Middle;
