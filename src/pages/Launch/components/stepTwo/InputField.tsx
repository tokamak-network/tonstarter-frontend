import {Input} from '@chakra-ui/react';
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
};

const InputField: React.FC<InputFieldProp> = (props) => {
  const {w, h, fontSize, placeHolder, setValue, value, formikName} = props;
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

      console.log(vaultObj);
      console.log(formikName);
      //@ts-ignore
      console.log(vaultObj[formikName]);

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

      const isOver = true;

      if (isOver) {
        return setIsErr(true);
      }
      return setIsErr(false);
    }
  }, [selectedVault, thisVaultValue, formikName, value, tempVaultData]);

  const tokensRef = useRef([]);

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
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        if (formikName) {
          dispatch(
            saveTempVaultData({
              data: {
                ...tempVaultData,
                [formikName]: e.target.value,
              },
            }),
          );
        }
      }}></Input>
  );
};

export default InputField;
