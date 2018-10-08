export const secondToMinute = (number) => {
  const second = number % 60;
  return `${Math.floor(number / 60)}:${second > 9 ? second : `0${second}`}`;
};

export const a = 1;
