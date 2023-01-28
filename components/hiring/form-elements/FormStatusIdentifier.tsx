import React from 'react';
import Step from './Step';

type Props = {
  activeFormStep: number;
  setActiveFormStep: React.Dispatch<React.SetStateAction<number>>;
  errors: {
    companyData?: any;
    companyDescription?: any;
    companyWebsite?: any;
    email?: any;
    jobTitle?: any;
    jobDescription?: any;
    category?: any;
    jobType?: any;
    locationInfo?: any;
    salary?: any;
    applicationMethod?: any;
    apply?: any;
    sdg?: any;
    acceptedPaymentTerms?: any;
    sdgsInfo?: any;
  };
};

const FormStatusIdentifier = ({
  setActiveFormStep,
  errors,
  activeFormStep,
}: Props) => {
  return (
    <div>
      <div className="shadow-1 flex justify-around rounded-full bg-white py-2">
        <Step
          errors={[
            errors.companyData?.name,
            errors.companyDescription,
            errors.companyWebsite,
          ]}
          step={1}
          activeFormStep={activeFormStep}
          setActiveFormStep={setActiveFormStep}
        />
        <Step
          errors={errors?.sdgsInfo}
          step={2}
          activeFormStep={activeFormStep}
          setActiveFormStep={setActiveFormStep}
        />
        <Step
          errors={[errors.jobTitle, errors.jobDescription]}
          step={3}
          activeFormStep={activeFormStep}
          setActiveFormStep={setActiveFormStep}
        />
        <Step
          errors={[
            errors.category,
            errors.jobType,
            errors.locationInfo,
            errors.salary,
            errors.applicationMethod,
            errors.apply,
            errors.acceptedPaymentTerms,
          ]}
          step={4}
          activeFormStep={activeFormStep}
          setActiveFormStep={setActiveFormStep}
        />
      </div>
      <div className="my-12 text-center lg:my-16">
        <h1 className="heading-xl my-8">
          {activeFormStep === 1 && 'Start by filling in your company details'}
          {activeFormStep === 2 && 'Sustainable Development Goals'}
          {activeFormStep === 3 && 'Tell us about the Job'}
          {activeFormStep === 4 && 'Finalize the Job Listing'}
        </h1>
        <p className="text-main">
          {activeFormStep === 1 &&
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diamonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimat'}
          {activeFormStep === 2 &&
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diamonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimat'}
          {activeFormStep === 3 &&
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diamonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimat'}
          {activeFormStep === 4 &&
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diamonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimat'}
        </p>
      </div>
    </div>
  );
};

export default FormStatusIdentifier;
