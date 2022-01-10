import {Select} from '@chakra-ui/select';
import {Dispatch, SetStateAction} from 'react';

type CustomSelectBoxProp = {
  w: string;
  h: string;
  list: string[];
  optionName?: string[];
  setValue: Dispatch<SetStateAction<any>>;
  titleValue?: string;
  fontSize?: string;
};

export const CustomSelectBox = (prop: CustomSelectBoxProp) => {
  const {w, h, list, setValue, titleValue, fontSize, optionName} = prop;

  return (
    <Select
      w={w}
      h={h}
      fontSize={fontSize || '0.750em'}
      onChange={(e) => {
        const type = e.target.value;
        setValue(type);
      }}>
      {titleValue ? (
        <option value="" disabled selected hidden>
          {titleValue}
        </option>
      ) : null}
      {list.map((e: string, index: number) => {
        return (
          <option value={e}>{(optionName && optionName[index]) || e}</option>
        );
      })}
    </Select>
  );
};
