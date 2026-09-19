import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveOnboardingApi } from '../../api/onboarding.api';
import getError from '../../utils/getError';

export const saveOnboarding = createAsyncThunk(
  'onboarding/save',
  async (_, { getState, rejectWithValue }) => {
    const {
      language, locationEnabled, professionId, topicIds,
      voiceId, briefMinutes, deliveryTime, notifications,
    } = getState().onboarding;

    try {
      const { data } = await saveOnboardingApi({
        language, locationEnabled, professionId, topicIds,
        voiceId, briefMinutes, deliveryTime, notifications,
      });
      return data.data; // updated user profile
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);