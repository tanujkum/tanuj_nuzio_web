import * as yup from 'yup';

export const professionSchema = yup.object({
  professionId: yup.number().typeError('Select your profession').required('Select your profession'),
});

export const topicsSchema = yup.object({
  topicIds: yup.array().of(yup.number())
    .min(1, 'Pick at least 1 topic')
    .max(7, 'You can pick up to 7 topics')
    .required('Pick at least 1 topic'),
});

export const voiceLengthSchema = yup.object({
  voiceId: yup.number().typeError('Pick a narrator').required('Pick a narrator'),
  briefMinutes: yup.number().typeError('Enter minutes')
    .integer('Whole minutes only').min(3, 'Min 3 minutes').max(30, 'Max 30 minutes')
    .required('Enter minutes'),
});

export const deliveryTimeSchema = yup.object({
  deliveryTime: yup.string()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time')
    .required('Pick a time'),
});


// Final submit se pehle poora data ek saath check karne ke liye
export const fullOnboardingSchema = professionSchema
  .concat(topicsSchema)
  .concat(voiceLengthSchema)
  .concat(deliveryTimeSchema);