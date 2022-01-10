export const convertLocaleString: (arg: string, digits?: number) => string = (
  arg,
  digits,
) => {
  const convertedNum = Number(arg).toLocaleString(undefined, {
    minimumFractionDigits: digits ?? 2,
  });
  return String(convertedNum);
};
