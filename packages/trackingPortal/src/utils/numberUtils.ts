export const convertToKilo = (value: number): string | number => {
  const result = value / 1000;
  if (result >= 1) {
    return `${result}K`;
  } else {
    return value;
  }
};
