import moment from 'moment';

type MiddleTable = {
  claimTime: string;
  tokenAllocation: string;
  accumulated: string;
};

const nowTimeStamp = moment().unix();

const defaultTableValue: MiddleTable[] = [
  {
    claimTime: moment().format('MM.DD.YYYY hh:mm:ss'),
    tokenAllocation: '2,000,000',
    accumulated: '0.20',
  },
  {
    claimTime: moment().add(30, 'days').format('MM.DD.YYYY hh:mm:ss'),
    tokenAllocation: '2,000,000',
    accumulated: '0.20',
  },
  {
    claimTime: moment().add(60, 'days').format('MM.DD.YYYY hh:mm:ss'),
    tokenAllocation: '2,000,000',
    accumulated: '0.20',
  },
  {
    claimTime: moment().add(90, 'days').format('MM.DD.YYYY hh:mm:ss'),
    tokenAllocation: '2,000,000',
    accumulated: '0.20',
  },
  {
    claimTime: moment().add(120, 'days').format('MM.DD.YYYY hh:mm:ss'),
    tokenAllocation: '2,000,000',
    accumulated: '0.20',
  },
  {
    claimTime: moment().add(150, 'days').format('MM.DD.YYYY hh:mm:ss'),
    tokenAllocation: '2,000,000',
    accumulated: '0.20',
  },
];

export default defaultTableValue;
