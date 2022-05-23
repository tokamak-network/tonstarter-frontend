import moment from 'moment';
import {useEffect, useState} from 'react';

const useDate = (props: {format?: string}): {nextThu: string} => {
  const {format} = props;
  const [nextThu, setNextThu] = useState<string>('');
  useEffect(() => {
    //GET NEXT THUR
    //Which is lock period for sTOS
    const dayINeed = 4; // for Thursday
    const dateFormat = format || 'YYYY-MM-DD';
    const today = moment().isoWeekday();
    const thisWed = moment().isoWeekday(dayINeed).format(dateFormat);
    const nextWed = moment()
      .add(1, 'weeks')
      .isoWeekday(dayINeed)
      .format(dateFormat);
    if (today < dayINeed) {
      return setNextThu(thisWed);
    } else {
      return setNextThu(nextWed);
    }
  }, [format]);

  return {nextThu};
};

export default useDate;