import * as yup from 'yup';

export const loginSchema = yup.object({
  name: yup.string().trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .required('Name is required'),
  email: yup.string().trim().lowercase()
    .email('Enter a valid email')
    .required('Email is required'),
});