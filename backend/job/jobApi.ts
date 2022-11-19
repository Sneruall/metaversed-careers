import { customAlphabet } from 'nanoid';
import { jobCategoriesList, jobCategory } from '../../types/jobCategories';
import { Company, Form, Job, LocationInfo, sdgList } from '../../types/types';
import { convertCommaSeparatedStringToArray } from '../../helpers/arrayConversions';
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps';
import { max } from '@cloudinary/url-gen/actions/roundCorners';

/* Creating a random string of 7 characters from the alphabet. */
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 7);

/**
 * It returns the current timestamp in milliseconds
 * @returns A function that returns the current time in milliseconds.
 */
export const registerJobTimestamp = () => {
  return new Date().getTime();
};

export const setJobId = () => {
  return nanoid();
};

export async function transformFormData(
  formData: Form,
  jobDescriptionHtml: string,
  companyDescriptionHtml: string,
  salaryValues: {
    minSalary: CurrencyInputOnChangeValues;
    maxSalary: CurrencyInputOnChangeValues;
  },
  retrievedCompanyData?: Company,
  imagePublicId?: string
) {
  let result: Job = {
    category: formData.category,
    email: formData.email,
    apply: formData.apply,
    applicationMethod: formData.applicationMethod,
    companyId: setCompanyId(retrievedCompanyData?.id),
    jobTitle: formData.jobTitle,
    jobDescription: formData.jobDescription,
    jobType: formData.jobType,
    id: setJobId(),
    price: 50,
    paid: true,
    closed: false,
    external: false,
    hidden: false,
    listed: true,
    locationInfo: formData.locationInfo,
    timestamp: registerJobTimestamp(),
    salary: formData.salary,
    companyData: formData.companyData,
    sdg: ['1'],
  };

  convertLocationsToArrays(result.locationInfo);
  mapCategoryToObject(result.category);
  setLogo(result.companyData.logo, imagePublicId, retrievedCompanyData?.logo);
  setHTMLDescription(jobDescriptionHtml, result.jobDescription);
  setHTMLDescription(companyDescriptionHtml, result.companyData.description);
  setSalary(result, salaryValues);

  return result;
}

export const setDefaultJobAttributes = (formData: Form) => {
  // Set other job data attributes
  formData.sdg = ['1'];
  formData.timestamp = registerJobTimestamp();
  formData.id = setJobId();
  formData.price = 50; // set the price
  formData.paid = true; // set the payment status
  formData.hidden = false; // determine if the job is hidden from the platform overal
  formData.listed = true; // determine if the job is listed in the jobs lists
  formData.closed = false; // determine if the job is marked as closed
  formData.external = false; // determine if the job is external (e.g. from remotive)
};

export const convertLocationsToArrays = (locationInfo: LocationInfo) => {
  if (locationInfo.onSiteLocation) {
    locationInfo.onSiteLocation = convertCommaSeparatedStringToArray(
      locationInfo.onSiteLocation
    );
  }
  if (locationInfo.geoRestrictionOther) {
    locationInfo.geoRestrictionOther = convertCommaSeparatedStringToArray(
      locationInfo.geoRestrictionOther
    );
  }
};

export const setHTMLDescription = (descriptionHtml: string, data?: string) => {
  data = descriptionHtml;
};

export const setCompanyId = (
  retrievedCompanyId: Job['companyId'] | undefined
) => {
  // Check if the company already exists in the database
  // If it exists take over the id and assign it to the job posting
  if (retrievedCompanyId) {
    return retrievedCompanyId;
  } else {
    // If it does not exist:
    return nanoid();
  }
};

export async function mapCategoryToObject(category: jobCategory) {
  category = createCategoryObject(category as unknown as string)!;
}

export async function setLogo(
  logo: string | undefined,
  imagePublicId: string | undefined,
  retrievedLogo: string | undefined
) {
  if (imagePublicId || retrievedLogo) {
    logo = imagePublicId || retrievedLogo;
  }
}

export async function filterSdgData(formData: Form) {
  const sdgData = formData.companyData.sdgInfo;
  const filteredSdgData: {}[] = [];

  for (const key in sdgData) {
    console.log(`${key}: ${sdgData[key as keyof Boolean]}`);
    if (sdgData[key as keyof Boolean]) {
      let object: any = {};
      object[key] = sdgData[key as keyof Boolean];
      filteredSdgData.push(object);
    }
  }
  console.log('filteredSdgData ' + JSON.stringify(filteredSdgData));
  return filteredSdgData;
}

/**
 * It takes a category name as a string and returns the corresponding jobCategory object
 * @param category - jobCategory['name']
 * @returns An object with the name and color of the category.
 */
const createCategoryObject = (category: jobCategory['name']) => {
  return jobCategoriesList.find((jobCategory) => jobCategory.name === category);
};
export async function setSalary(
  result: Job,
  salaryValues: {
    minSalary: CurrencyInputOnChangeValues;
    maxSalary: CurrencyInputOnChangeValues;
  }
) {
  if (salaryValues.minSalary) {
    result.salary!.min = salaryValues.minSalary;
  }
  if (salaryValues.maxSalary) {
    result.salary!.max = salaryValues.maxSalary;
  }
}

export async function postJob(formData: Form) {
  // Post the job data in the Database
  //todo no console log and nothing is done with data?

  const response = await fetch('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(formData), //todo only save what we need, like postCompany does, convert Form to Job.
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
}
