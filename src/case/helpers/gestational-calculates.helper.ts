import * as dayjs from 'dayjs';

export type GestationalAge = {
  days: number;
  weeks: number;
};

export const GestationalCalculatesHelper = (
  start: string,
  end: string,
): GestationalAge => {
  const [start_, end_] = transformDatesToUnix(start, end);
  const difference = (end_ - start_) / (3600 * 24);
  const weeks = Math.floor(difference / 7);
  const days = difference % 7;

  return {
    days,
    weeks,
  };
};

const transformDatesToUnix = (start: string, end: string): number[] => {
  return [dayjs(start).unix(), dayjs(end).unix()];
};
