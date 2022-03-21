import {Input} from '@chakra-ui/react';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {Dispatch, SetStateAction} from 'react';

type InputFieldProp = {
  w: number;
  h: number;
  placeHolder?: string;
  fontSize: number;
  setValue: Dispatch<SetStateAction<any>>;
  value?: any;
  formikName?: string;
};

const InputField: React.FC<InputFieldProp> = (props) => {
  const {w, h, fontSize, placeHolder, setValue, value, formikName} = props;
  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData},
  } = useAppSelector(selectLaunch);

  return (
    <Input
      w={`${w}px`}
      h={`${h}px`}
      fontSize={fontSize}
      placeholder={placeHolder}
      _focus={{}}
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
      }}
      // onChange={(e) => setValue(e.target.value)}
    ></Input>
  );
};

export default InputField;
