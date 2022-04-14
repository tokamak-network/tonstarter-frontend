import {Input, NumberInput, NumberInputField} from '@chakra-ui/react';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {Projects, Vault, VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';

type InputFieldProp = {
  w: number;
  h: number;
  placeHolder?: string;
  fontSize: number;
  setValue: Dispatch<SetStateAction<any>>;
  value: any;
  formikName?: string;
  isStosTier?: boolean;
  stosTierLevel?: 1 | 2 | 3 | 4;
  numberOnly?: boolean;
};

const InputField: React.FC<InputFieldProp> = (props) => {
  const {
    w,
    h,
    fontSize,
    placeHolder,
    setValue,
    value,
    formikName,
    isStosTier,
    stosTierLevel,
    numberOnly,
  } = props;
  const [isErr, setIsErr] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData, selectedVault},
  } = useAppSelector(selectLaunch);
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const thisVaultValue = vaultsList.filter((vault: Vault) => {
    if (vault.vaultName === selectedVault) {
      return vault;
    }
  });

  useEffect(() => {
    if (selectedVault === 'Public' && formikName) {
      const vaultObj = thisVaultValue[0] as VaultPublic;
      const {
        vaultTokenAllocation,
        publicRound1Allocation,
        publicRound2Allocation,
        hardCap,
      } = vaultObj;
      const {
        publicRound1Allocation: _publicRound1Allocation,
        publicRound2Allocation: _publicRound2Allocation,
        hardCap: _hardCap,
      } = tempVaultData as any;

      // console.log(vaultObj);
      // console.log(formikName);
      // //@ts-ignore
      // console.log(vaultObj[formikName]);

      //@ts-ignore
      const thisNameValue = vaultObj[formikName];

      // const isOver =
      //   Number(vaultTokenAllocation) <
      //   Number(
      //     Number(publicRound1Allocation) !== 0
      //       ? Number(publicRound1Allocation)
      //       : Number(_publicRound1Allocation || 0) +
      //           Number(publicRound2Allocation) !==
      //         0
      //       ? Number(publicRound2Allocation)
      //       : Number(_publicRound2Allocation || 0) + Number(hardCap) !== 0
      //       ? Number(hardCap)
      //       : Number(_hardCap || 0) - Number(thisNameValue) + Number(inputVal),
      //   );

      // const isOver = true;

      // if (isOver) {
      //   return setIsErr(true);
      // }
      // return setIsErr(false);
    }
  }, [selectedVault, thisVaultValue, formikName, value, tempVaultData]);

  const tokensRef = useRef([]);

  const stosTier =
    stosTierLevel === 1
      ? 'oneTier'
      : stosTierLevel === 2
      ? 'twoTier'
      : stosTierLevel === 3
      ? 'threeTier'
      : 'fourTier';

  let allocatedTokenData = '';
  let requiredStosData = '';

  //@ts-ignore
  if (tempVaultData?.stosTier?.[stosTier]) {
    //@ts-ignore
    const {requiredStos, allocatedToken} = tempVaultData.stosTier?.[stosTier];
    allocatedTokenData = allocatedToken;
    requiredStosData = requiredStos;
  }

  if (numberOnly) {
    return (
      <NumberInput>
        <NumberInputField
          w={`${w}px`}
          h={`${h}px`}
          focusBorderColor={isErr ? 'red.100' : '#dfe4ee'}
          fontSize={fontSize}
          placeholder={placeHolder}
          value={value === 'undefined' ? '' : value}
          onChange={(e) => {
            setValue(e.target.value);
            if (formikName) {
              !isStosTier
                ? dispatch(
                    saveTempVaultData({
                      data: {
                        ...tempVaultData,
                        [formikName]: Number(e.target.value),
                      },
                    }),
                  )
                : dispatch(
                    saveTempVaultData({
                      data: {
                        ...tempVaultData,
                        stosTier: {
                          //@ts-ignore
                          ...tempVaultData.stosTier,
                          [stosTier]: {
                            [formikName]: e.target.value,
                            [formikName === 'requiredStos'
                              ? 'allocatedToken'
                              : 'requiredStos']:
                              formikName === 'requiredStos'
                                ? allocatedTokenData
                                : requiredStosData,
                          },
                        },
                      },
                    }),
                  );
            }
          }}
        />
      </NumberInput>
    );
  }

  return (
    <Input
      w={`${w}px`}
      h={`${h}px`}
      focusBorderColor={isErr ? 'red.100' : '#dfe4ee'}
      fontSize={fontSize}
      placeholder={placeHolder}
      // _focus={{}}
      //@ts-ignore
      ref={(el) => (tokensRef.current[formikName] = el)}
      value={value === 'undefined' ? '' : value}
      onChange={(e) => {
        setValue(e.target.value);

        if (formikName) {
          !isStosTier
            ? dispatch(
                saveTempVaultData({
                  data: {
                    ...tempVaultData,
                    [formikName]: e.target.value,
                  },
                }),
              )
            : dispatch(
                saveTempVaultData({
                  data: {
                    ...tempVaultData,
                    stosTier: {
                      //@ts-ignore
                      ...tempVaultData.stosTier,
                      [stosTier]: {
                        [formikName]: e.target.value,
                        [formikName === 'requiredStos'
                          ? 'allocatedToken'
                          : 'requiredStos']:
                          formikName === 'requiredStos'
                            ? allocatedTokenData
                            : requiredStosData,
                      },
                    },
                  },
                }),
              );
        }
      }}></Input>
  );
};

export default InputField;
