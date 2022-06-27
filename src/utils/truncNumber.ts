function truncNumber(number: number, digits: number): number {
  number = Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits);
  return number;
}

export default truncNumber;
