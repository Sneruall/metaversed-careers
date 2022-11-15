import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { checkCompany, postCompany } from '../../backend/company/companyApi';
import {
  convertLocationsToArrays,
  mapCategoryToObject,
  postJob,
  setCompanyId,
  setDefaultJobAttributes,
  setHTMLDescription,
  setLogo,
  setSalary,
} from '../../backend/job/jobApi';
import {
  ApplicationMethod,
  Job,
  Company,
  jobTypes,
  currencies,
  SalaryPeriod,
  LocationObject,
  Location as LocationOptions,
  ApplicationMethods,
} from '../../types/types';
import hiringValidationSchema from '../../validations/hiringValidationSchema';
import CompanyChecker from './CompanyChecker';
import FormFieldString from './FormFieldString';
import FormFieldDropdown from './FormFieldDropdown';
import GeoRestrictionElement from './form-elements/GeoRestrictionElement';
import CurrencyInput, { formatValue } from 'react-currency-input-field';
import {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from 'react-currency-input-field/dist/components/CurrencyInputProps';
import RichTextEditor from './form-elements/richtext/RichTextEditor';
import { generateCategoriesArray } from '../../types/jobCategories';
import SdgElement from './form-elements/SdgElement';
import LogoUploader from './form-elements/LogoUploader';
import FormNavigation from './form-elements/FormNavigation';
import FormStatusIdentifier from './form-elements/FormStatusIdentifier';

function Form() {
  // Form step management
  const [formStep, setFormStep] = useState(1);

  const changeFormStep = (step: number) => {
    if (step === 0 || step === 5) {
      return;
    } else {
      setFormStep(step);
    }
  };

  // Checking the entered company name with what is already in the DB
  const [retrievedCompanyData, setRetrievedCompanyData] = useState<Company>();
  const [companyNameIsLoading, setCompanyNameIsLoading] = useState<boolean>();

  // logo upload
  const [imagePublicId, setImagePublicId] = useState('');

  // company website tracking
  const [website, setWebsite] = useState('');

  // Location fields tracking
  const [locationInfo, setLocationObject] = useState<LocationObject>({
    location: 'remote',
    otherGeoRestriction: false,
  });

  // SDG fields tracking
  const [sdgs, setSdgs] = useState<string[]>([]);

  // Application method tracking
  const [applicationMethod, setApplicationMethod] =
    useState<ApplicationMethod>('email');

  //Currency tracking
  const [currency, setCurrency] = useState<string>('US$');
  const [salaryValues, setSalaryValues] = useState<{
    minSalary: CurrencyInputOnChangeValues;
    maxSalary: CurrencyInputOnChangeValues;
  }>({
    minSalary: { float: null, formatted: '', value: '' },
    maxSalary: { float: null, formatted: '', value: '' },
  });

  const handleOnValueChange: CurrencyInputProps['onValueChange'] = (
    value,
    name,
    values
  ): void => {
    if (values) {
      if (name === 'salary.min') {
        setSalaryValues((prevState) => ({
          ...prevState,
          minSalary: values,
        }));
      } else {
        setSalaryValues((prevState) => ({
          ...prevState,
          maxSalary: values,
        }));
      }
    }
  };

  const [jobDescriptionHtml, setjobDescriptionHtml] = useState('');
  const [companyDescriptionHtml, setcompanyDescriptionHtml] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Job>({
    resolver: yupResolver(hiringValidationSchema),
    mode: 'all',
  });

  async function onSubmit(formData: Job) {
    setDefaultJobAttributes(formData);
    convertLocationsToArrays(formData);
    mapCategoryToObject(formData);
    setCompanyId(formData, retrievedCompanyData?.id);
    setLogo(formData, imagePublicId, retrievedCompanyData?.logo);
    setHTMLDescription(formData, jobDescriptionHtml, 'job');
    setHTMLDescription(formData, companyDescriptionHtml, 'company');
    setSalary(formData, salaryValues);
    try {
      await postJob(formData);
      await postCompany(formData, retrievedCompanyData);
    } catch {
      // todo: log errors here, based on what is returned from the APIs.
      console.log(
        'an error occurred when posting job and company data into our database'
      );
    }
    reset();
  }

  return (
    <div className="">
      <div className="my-12 lg:my-24">
        <h1 className="mx-auto max-w-xl text-center font-alfa text-xl text-custom-brown1 sm:text-3xl md:text-5xl md:leading-snug lg:max-w-3xl lg:text-6xl lg:leading-snug">
          Find your next employee with us
        </h1>
      </div>
      <FormStatusIdentifier
        setFormStep={setFormStep}
        formStep={formStep}
        errors={errors}
      />

      <form
        className="mx-auto max-w-xl"
        id="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* ////-------/////------////------- STEP 1 -----////------////---////----//// */}

        {/* COMPANY FIELDS */}
        <div className={`${formStep !== 1 && 'hidden'}`}>
          <div className="mb-6">
            {/* COMPANY NAME */}
            <FormFieldString
              id="companyData.name"
              title="Organization name*"
              errors={errors.companyData?.name}
              placeholder="e.g. Greenpeace"
              register={register}
              onChangeMethod={(event: React.ChangeEvent<HTMLInputElement>) => {
                checkCompany(
                  event?.target.value,
                  setCompanyNameIsLoading,
                  setRetrievedCompanyData,
                  setWebsite
                );
              }}
            />
            <CompanyChecker
              companyNameIsLoading={companyNameIsLoading}
              errorsCompanyName={errors.companyData?.name}
              retrievedCompanyData={retrievedCompanyData}
            />
          </div>
          {/* EMAIL */}
          <div className="mb-6">
            <FormFieldString
              errors={errors.email}
              id="email"
              register={register}
              title="Email"
              description="Stays private, for verification/invoice delivery only."
            />
          </div>

          <div className="flex flex-col gap-5">
            {/* DESCRIPTION */}
            <div>
              <h2 className="font-bold text-custom-brown1">
                Organization description
              </h2>
              <RichTextEditor
                key={retrievedCompanyData?.id}
                placeholder="Write something about your oganization..."
                state={setcompanyDescriptionHtml}
                defaultValue={
                  retrievedCompanyData ? retrievedCompanyData.description : ''
                }
              />
            </div>
            {/* COMPANY LOGO */}
            <LogoUploader
              key={retrievedCompanyData?.logo}
              retrievedLogo={retrievedCompanyData?.logo}
              imagePublicId={imagePublicId}
              setImagePublicId={setImagePublicId}
            />
            {/* COMPANY WEBSITE */}
            <div className="">
              <label
                htmlFor="companyData.website"
                className="font-bold text-custom-brown1"
              >
                Company website (optional)
              </label>
              <input
                key={retrievedCompanyData?.website}
                id="companyData.website"
                type="text"
                placeholder="www.yourcompany.com"
                value={website}
                {...register('companyData.website')}
                onChange={(e) => setWebsite(e?.target.value)}
                className={`my-2 block w-full rounded-lg border border-[#D5D3D3] bg-white py-3 px-4 text-sm text-black shadow-[0_9px_20px_0px_rgba(0,0,0,0.06)] focus:outline-none ${
                  errors.companyData?.website
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300  focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              <div className="text-red-500">
                {errors.companyData?.website?.message}
              </div>
            </div>
          </div>
        </div>

        {/* ////-------/////------////------- STEP 2 -----////------////---////----//// */}

        {/* SUSTAINABLE DEVELOPMENT GOALS (SDG) */}

        <div className={`${formStep !== 2 && 'hidden'}`}>
          {/* SDG */}
          <div className="">
            <h2 className="font-bold text-custom-brown1">
              Sustainable development goals (select max 5) We will verify.
            </h2>
            {retrievedCompanyData && (
              <p className="text-green-500">
                Hey, we found the below data already, you can adjust but we will
                then need to reverify your SDGs
              </p>
            )}
            <div className="my-2">
              <SdgElement
                errors={errors?.locationInfo?.geoRestriction}
                register={register}
                setSdgs={setSdgs}
              />
            </div>

            <div className="text-red-500">{(errors.sdg as any)?.message}</div>
          </div>
        </div>

        {/* ////-------/////------////------- STEP 3 -----////------////---////----//// */}

        <div className={`${formStep !== 3 && 'hidden'}`}>
          <div className="flex flex-col gap-5">
            {/* JOB TITLE */}
            <FormFieldString
              id="jobTitle"
              title="Job Title*"
              placeholder="e.g. Senior Product Manager"
              register={register}
              errors={errors.jobTitle}
            />

            {/* JOB DESCRIPTION  */}
            <div>
              <h2 className="text-base font-bold">Job description*</h2>
              <RichTextEditor
                placeholder="Write a good job description..."
                state={setjobDescriptionHtml}
              />
            </div>
          </div>
        </div>

        {/* ////-------/////------////------- STEP 4 -----////------////---////----//// */}
        <div className={`${formStep !== 4 && 'hidden'}`}>
          <div className="flex flex-col gap-5">
            {/* CATEGORY */}
            <FormFieldDropdown
              errors={errors.category}
              id="category"
              register={register}
              title="Category*"
              options={generateCategoriesArray()}
            />
            {/* JOB TYPES */}
            <FormFieldDropdown
              id="jobType"
              register={register}
              errors={errors.jobType}
              title="Type of Employment"
              options={jobTypes}
            />

            <div>
              <label
                htmlFor={locationInfo.location}
                className="font-bold text-custom-brown1"
              >
                Location
              </label>
              <select
                {...register('locationInfo.location')}
                onChange={(e) => {
                  const value = e.target.value as LocationOptions;
                  setLocationObject((prevState) => ({
                    ...prevState,
                    location: value,
                  }));
                }}
                id={locationInfo.location}
                className={`my-2 block w-full rounded-lg border bg-white py-3 px-4 text-sm text-black shadow-[0_9px_20px_0px_rgba(0,0,0,0.06)] focus:outline-none`}
              >
                {LocationOptions.map((option) => (
                  <option value={option.value} key={option.id}>
                    {option.title}
                  </option>
                ))}
              </select>
              <div className="text-red-500">
                {errors?.locationInfo?.location?.message}
              </div>
            </div>

            {/* ON SITE LOCATION */}
            {locationInfo.location !== 'remote' && (
              <FormFieldString
                errors={errors.locationInfo?.onSiteLocation}
                id="locationInfo.onSiteLocation"
                register={register}
                title="On Site Location(s)"
                placeholder="e.g. Amsterdam, London, New York"
                description="Please use a comma to separate multiple locations."
              />
            )}

            {/* GEOGRAPHIC RESTRICTION */}
            {locationInfo.location !== 'onSite' && (
              <div>
                <div className="">
                  <label className="font-bold text-custom-brown1">
                    Remote Areas
                  </label>
                  <p className="text-sm text-gray-500">
                    Hiring worldwide or for specific areas?
                  </p>

                  <GeoRestrictionElement
                    errors={errors?.locationInfo?.geoRestriction}
                    register={register}
                    setLocationObject={setLocationObject}
                  />
                  <div className="text-red-500">
                    {(errors.locationInfo?.geoRestriction as any)?.message}
                  </div>
                </div>

                {locationInfo.otherGeoRestriction && (
                  <FormFieldString
                    errors={errors.locationInfo?.geoRestrictionOther}
                    id="locationInfo.geoRestrictionOther"
                    register={register}
                    placeholder="e.g. Switzerland"
                  />
                )}
              </div>
            )}
            {/* SALARY */}
            <div>
              <h3 className="font-bold text-custom-brown1">
                Base Salary (optional)
              </h3>
              <div className="flex gap-2">
                <div className="flex">
                  <div className="flex-none">
                    <FormFieldDropdown
                      errors={errors.salary?.currency}
                      id="salary.currency"
                      options={currencies}
                      register={register}
                      onChangeMethod={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setCurrency(e?.target?.value);
                      }}
                      twinleft
                    />
                  </div>
                  <div className="flex-1">
                    <CurrencyInput
                      maxLength={6}
                      id="salary.min"
                      allowDecimals={false}
                      disableAbbreviations={false}
                      step={10}
                      placeholder="Amount or Minimum"
                      {...register('salary.min')}
                      onValueChange={handleOnValueChange}
                      className={`my-2 block w-full rounded-lg rounded-l-none border border-l-0 bg-white py-3 px-4 text-sm text-black shadow-[0_9px_20px_0px_rgba(0,0,0,0.06)] focus:outline-none ${
                        errors?.salary?.min
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300  focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  <div className="text-red-500">{errors?.salary?.min}</div>
                </div>
                <div className="my-auto">-</div>

                <div className="flex-1">
                  <CurrencyInput
                    maxLength={6}
                    id="salary.max"
                    allowDecimals={false}
                    prefix={currency}
                    step={10}
                    placeholder="Maximum (optional)"
                    {...register('salary.max')}
                    onValueChange={handleOnValueChange}
                    className={`my-2 block w-full rounded-lg border bg-white py-3 px-4 text-sm text-black shadow-[0_9px_20px_0px_rgba(0,0,0,0.06)] focus:outline-none ${
                      errors?.salary?.max
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300  focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <div className="text-red-500">{errors?.salary?.max}</div>
                </div>
                <FormFieldDropdown
                  id="salary.period"
                  errors={errors.salary?.period}
                  options={SalaryPeriod}
                  register={register}
                />
              </div>
            </div>
            {/* APPLY BY: todo: add form as option */}
            <div className="">
              <div>
                <label
                  htmlFor={applicationMethod}
                  className="font-bold text-custom-brown1"
                >
                  How can People Apply?
                </label>
                <select
                  {...register('applicationMethod')}
                  onChange={(e) => {
                    const value = e.target.value as ApplicationMethod;
                    setApplicationMethod(value);
                  }}
                  id={applicationMethod}
                  className={`my-2 block w-full rounded-lg border bg-white py-3 px-4 text-sm text-black shadow-[0_9px_20px_0px_rgba(0,0,0,0.06)] focus:outline-none`}
                >
                  {ApplicationMethods.map((option) => (
                    <option value={option.value} key={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
                <div className="text-red-500">
                  {errors?.applicationMethod?.message}
                </div>
              </div>
            </div>

            <FormFieldString
              title={applicationMethod === 'email' ? 'E-mail' : 'Website Link'}
              errors={errors.apply}
              id="apply"
              register={register}
              placeholder={
                applicationMethod === 'email'
                  ? 'hiring@company.com'
                  : 'www.yourcompany.com/apply'
              }
            />
          </div>
        </div>
        {/* SUBMIT */}
        <div
          className={`flex justify-end space-x-4 ${formStep !== 4 && 'hidden'}`}
        >
          <button
            disabled={companyNameIsLoading}
            type="submit"
            className="rounded-full bg-yellow-500 px-4 py-2 text-white hover:bg-opacity-80"
          >
            Post Job - $200
          </button>{' '}
        </div>
      </form>
      <div className="mx-auto flex max-w-xl space-x-4">
        {/* FORM NAVIGATION */}
        <FormNavigation formStep={formStep} changeFormStep={changeFormStep} />
      </div>

      {/* RESET */}
      {/* <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-gray-400 px-4 py-2 text-white hover:bg-opacity-80"
      >
        Reset
      </button> */}
    </div>
  );
}

export default Form;
