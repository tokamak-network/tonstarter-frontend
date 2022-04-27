import {Input, NumberInput, NumberInputField} from '@chakra-ui/react';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {Dispatch, SetStateAction} from 'react';

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
  inputRef?: any;
  style?: {};
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
    inputRef,
    style,
  } = props;
  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData},
  } = useAppSelector(selectLaunch);
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;

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
          focusBorderColor={'#dfe4ee'}
          fontSize={fontSize}
          placeholder={placeHolder}
          value={value === 'undefined' ? '' : value}
          onChange={(e) => {
            //@ts-ignore
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
      focusBorderColor={'#dfe4ee'}
      fontSize={fontSize}
      placeholder={placeHolder}
      // _focus={{}}
      ref={(el) => {
        if (inputRef && formikName) {
          if (stosTierLevel) {
            inputRef.current[`${formikName}_${stosTierLevel}`] = el;
          }
          // inputRef.current[index + 1] = el;
          inputRef.current[formikName] = el;
        }
      }}
      value={value === 'undefined' ? '' : value}
      style={style}
      onChange={(e) => {
        setValue(e.target.value);
        const publicVaultValue = vaultsList[0] as VaultPublic;
        const {stosTier: stosTierData} = publicVaultValue;
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
                      ...stosTierData,
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
