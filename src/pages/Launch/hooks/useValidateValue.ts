import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';

const useValidateValue = () => {
  const [isPassed, setIsPassed] = useState<boolean>(false);
  // const {values} = useFormikContext<Projects['CreateProject']>();
  // const vaults = values.vaults;

  return {isPassed};
};

export default useValidateValue;
