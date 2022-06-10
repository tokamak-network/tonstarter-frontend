function commafy(num: number | string | undefined) {
  if (num === undefined) {
    return;
  }
  let str = num.toString().split('.');
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ').slice(0, 2);
  }
  return str.join('.');
}

export default commafy;
