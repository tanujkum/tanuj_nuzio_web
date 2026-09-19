import * as yup from 'yup';

export const searchSchema = yup.object({
  q: yup.string().trim().max(100, 'Search can be at most 100 characters'),
});