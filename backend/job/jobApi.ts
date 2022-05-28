import { customAlphabet } from 'nanoid';
import { Job } from '../../types/types';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 7); //prevent use of dashes (conflicts in url)

export const registerJobTimestamp = () => {
  return new Date().getTime(); //to log the timestamp the form was submitted (ms since 1 jan 1970)
};

export const setJobId = () => {
  return nanoid();
};

export const setDefaultJobAttributes = (formData: Job) => {
  // Set other job data attributes
  formData.timestamp = registerJobTimestamp();
  formData.id = setJobId();
  formData.price = 50; // set the price
  formData.paid = true; // set the payment status
  formData.hidden = false; // set the visibility
};

export const setCompanyId = (
  formData: Job,
  retrievedCompanyId: Job['companyId'] | undefined
) => {
  // Check if the company already exists in the database
  // If it exists take over the id and assign it to the job posting
  if (retrievedCompanyId) {
    formData.companyId = retrievedCompanyId;
  } else {
    // If it does not exist:
    formData.companyId = nanoid();
  }
};
