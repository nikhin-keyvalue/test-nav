import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createEditNoteValidation = (t: (arg: any) => string) =>
  z.object({
    title: z
      .string({ required_error: t('mandatoryMessage') })
      .min(1, t('mandatoryMessage')),
    content: z
      .string({ required_error: t('mandatoryMessage') })
      .min(1, t('mandatoryMessage')),
  });
