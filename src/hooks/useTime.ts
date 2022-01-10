import {useEffect, useState} from 'react';
import moment from 'moment';

export const useTime = (timeStamp: number) => {
  const [isPassed, setIsPassed] = useState<boolean>(false);

  useEffect(() => {
    setInterval(() => {
      const nowTimeStamp = moment().unix();
      setIsPassed(timeStamp < nowTimeStamp);
    }, 1000);
    /*eslint-disable*/
  }, []);

  return {isPassed};
};
