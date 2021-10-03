import moment from 'moment';

export function convertTimeStamp(timeStamp: number, format?: string): string {
  const date = moment.unix(timeStamp).format(format || 'YYYY.MM.D');
  return date;
}
