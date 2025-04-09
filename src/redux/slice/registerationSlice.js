import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  registrationSuccess: false,
  userId: null,
  profileCompleted: false,
  formData: {
    username: "ef",
    email: "fe@mail.com",
    password: "abc",
    confirmPassword: "abc",
    companyName: "",
    contactPhone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    websiteUrl: "",
    industry: "",
    companyDescription: "",
    logoUrl: null,
  },
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setRegistrationSuccess: (state, action) => {
      state.registrationSuccess = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setProfileCompleted: (state, action) => {
      state.profileCompleted = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      return initialState;
    },
  },
});

export const {
  setStep,
  setRegistrationSuccess,
  setUserId,
  setProfileCompleted,
  updateFormData,
  resetForm,
} = registrationSlice.actions;

export default registrationSlice.reducer;
