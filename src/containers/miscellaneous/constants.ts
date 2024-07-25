import { z } from 'zod';

import { asOptionalField } from '@/utils/validations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EditMiscellaneousValidationSchema = (_t: (arg: any) => string) =>
  z
    .object({
      showPreview: asOptionalField(z.boolean()),
      shipHtml: asOptionalField(z.boolean()),
    })
    .passthrough();
