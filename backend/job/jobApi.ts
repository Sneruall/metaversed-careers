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
  formData.listed = true;
  if (formData.locationInfo.location === 'onSite') {
    formData.locationInfo.remoteLocation = undefined;
  }
};

// TODO: merge convertTags and convertOnSiteLocation functions (repeats code)

export const convertTags = (formData: Job) => {
  //todo account for entries like: holland,germany,    or ,holland, germany,,,
  if (formData.tags?.includes(',')) {
    // @ts-ignore: tags are entered as a string at first and then converted into array
    const commaSeparatedTags = formData.tags.replace(/\s*,\s*/g, ',');
    formData.tags = commaSeparatedTags.split(',').filter((a: string) => a); //splitsen op de comma en filteren op undefined or null elements in array
  }
};

//todo account for entries like: holland,germany,    or ,holland, germany,,,
export const convertCommaSeparatedStringToArray = (stringValue: string[]) => {
  console.log(stringValue);
  if (!stringValue) {
    return;
  }
  if (stringValue.includes(',')) {
    console.log(
      stringValue
        .toString()
        .replace(/\s*,\s*/g, ',')
        .split(',')
        .filter((a: string) => a)
    );
    return stringValue
      .toString()
      .replace(/\s*,\s*/g, ',')
      .split(',')
      .filter((a: string) => a);
  } else {
    return stringValue;
  }
};

//todo: refactor here, two functions below eachother very similar
export const convertOnSiteLocation = (formData: Job) => {
  //todo account for entries like: holland,germany,    or ,holland, germany,,,
  if (
    formData.locationInfo.onSiteLocation &&
    formData.locationInfo.onSiteLocation.includes(',')
  ) {
    const commaSeparatedLocations =
      // @ts-ignore: tags are entered as a string at first and then converted into array
      formData.locationInfo.onSiteLocation.replace(/\s*,\s*/g, ',');
    formData.locationInfo.onSiteLocation = commaSeparatedLocations
      .split(',')
      .filter((a: string) => a);
  }
};

export const convertOtherGeoRestriction = (formData: Job) => {
  //todo account for entries like: holland,germany,    or ,holland, germany,,,
  if (
    formData.locationInfo.geoRestrictionOther &&
    formData.locationInfo.geoRestrictionOther.includes(',')
  ) {
    const commaSeparatedLocations =
      // @ts-ignore: tags are entered as a string at first and then converted into array
      formData.locationInfo.geoRestrictionOther.replace(/\s*,\s*/g, ',');
    formData.locationInfo.geoRestrictionOther = commaSeparatedLocations
      .split(',')
      .filter((a: string) => a);
  }
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

export async function postJob(formData: Job) {
  // Post the job data in the Database
  //todo no console log and nothing is done with data?
  const response = await fetch('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
}
