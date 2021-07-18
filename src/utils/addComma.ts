import React from 'react';

export const addComma = (
  inputVal: any,
  setValue: React.Dispatch<React.SetStateAction<string>>,
) => {
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
        return setValue(_val);
      }

      return setValue(_val.substring(1, 2));
    }
    if (_val === '.') {
      return setValue(_val);
    } else {
      return setValue(
        _val
          .replace(/[^0-9a-zA-Z.]/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      );
    }
  };

  return checkInputVal();
};
