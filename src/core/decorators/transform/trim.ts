import { Transform } from 'class-transformer';

export const Trim = () => {
  return Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
};
