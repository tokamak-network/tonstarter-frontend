import {useState} from 'react';

export const useInput = () => {
  const [value, setValue] = useState<any>();
  const onChange = (event: any) => {
    const {target} = event;
    const {value: inputValue} = target;
    // if (isNaN(Number(inputValue)) === false) {
    //   return;
    // }
    const _val = inputValue;
    setValue(addComma(_val));
  };
  return {value, setValue, onChange};
};

const addComma = (inputVal: any) => {
  const _val = inputVal;

  const checkInputVal = () => {
    if (_val.split('.')[1]?.length >= 3) {
      return;
    }
    if (_val.split('.').length > 2) {
      return;
    }
    if (_val.length > 0 && _val.substring(0, 1) === '0') {
      if (_val.split('.').length > 1) {
        return _val;
      }

      return _val.substring(1, 2);
    }
    if (_val === '.') {
      console.log('c');
      return _val;
    } else {
      return _val
        .replace(/[^0-9a-zA-Z.]/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  return checkInputVal();
};
