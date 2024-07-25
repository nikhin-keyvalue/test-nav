import { z } from 'zod';

const emptyStringAndNullToUndefined = z.union([z.literal(null).transform(() => undefined), z.literal('').transform(() => undefined)]);

export function asOptionalField<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringAndNullToUndefined);
}

export function requiredWithRefine<T extends z.ZodTypeAny>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (arg: any) => string,
  schema: T
) {
  return schema.refine((value) => !!value, { message: t('mandatoryMessage') });
}

export function requiredWithRefineForNumber<T extends z.ZodTypeAny>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (arg: any) => string,
  schema: T
) {
  return schema.refine((value) => !!value || value === 0, {
    message: t('mandatoryMessage'),
  });
}

// Function to detect duplicate values in an array of primitives.
export function hasDuplicates(
  listOfValues: (string | boolean | number | null | undefined)[]
): boolean {
  return listOfValues?.length !== new Set(listOfValues).size;
}
