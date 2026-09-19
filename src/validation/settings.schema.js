import * as yup from 'yup';

export const briefPrefsSchema = yup.object({
  voiceId: yup.number().typeError('Pick a narrator').required('Pick a narrator'),
  briefMinutes: yup.number().typeError('Enter minutes')
    .integer('Whole minutes only').min(3, 'Min 3 minutes').max(30, 'Max 30 minutes')
    .required('Enter minutes'),
  deliveryTime: yup.string()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time')
    .required('Pick a time'),
});