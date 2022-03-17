import {Input} from '@chakra-ui/react';
import {Dispatch, SetStateAction} from 'react';

type InputFieldProp = {
  w: number;
  h: number;
  placeHolder?: string;
  fontSize: number;
  setValue: Dispatch<SetStateAction<any>>;
  value?: any;
};

const InputField: React.FC<InputFieldProp> = (props) => {
  const {w, h, fontSize, placeHolder, setValue, value} = props;
  return (
    <Input
      w={`${w}px`}
      h={`${h}px`}
      fontSize={fontSize}
      placeholder={placeHolder}
      _focus={{}}
      value={value}
      onChange={(e) => setValue(e.target.value)}></Input>
  );
};

export default InputField;
