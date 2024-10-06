export const convertToKilo = (value: number): string | number => {
  const result = value / 1000;
  if (result >= 1) {
    return `${result}K`;
  } else {
    return value;
  }
};

export const convertKiloToNumber = (number: string | number): number => {
  const _number = number.toString().toLowerCase();

  if (_number.includes("k")) {
    const numericPart = parseFloat(_number.replace("k", ""));
    return numericPart * 1000;
  }

  return Number(_number);
};
