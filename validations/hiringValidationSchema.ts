import * as Yup from 'yup';

// ERROR MESSAGE CONSTANTS
const REQUIRED_FIELD = 'This field is required.';
const CHARACTERS_NOT_ALLOWED =
  'This field contains characters that are not allowed.';
const MIN_2_CHARACTERS = 'This field must contain at least 2 characters.';
const MAX_50_CHARACTERS = 'This field must not exceed 50 characters.';

// REGEX
const ALPHANUMERIC_AND_SPECIFIC_CHARS =
  /^[A-Za-zÀ-ÖØ-öø-ÿ\w\-\s\(\)\%\+\,\.\&\#\/]+$/;
const NO_BACKWARD_SLASH = /^((?![\\\\]).)*$/;
const VALID_URL =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

export default Yup.object().shape({
  jobTitle: Yup.string()
    .required(REQUIRED_FIELD)
    .min(2, MIN_2_CHARACTERS)
    .matches(
      ALPHANUMERIC_AND_SPECIFIC_CHARS && NO_BACKWARD_SLASH,
      CHARACTERS_NOT_ALLOWED
    )
    .max(50, MAX_50_CHARACTERS),
  category: Yup.string().required(REQUIRED_FIELD), //todo: check if it is one of the options from our types.ts file?
  jobType: Yup.string().required(REQUIRED_FIELD), //todo: check if it is one of the options from our types.ts file?
  locationInfo: Yup.object().shape({
    location: Yup.string().required(REQUIRED_FIELD), //here and also maybe other fields: check if it is of type Location!
    onSiteLocation: Yup.string()
      .when('location', {
        is: 'onSite',
        then: Yup.string().required(REQUIRED_FIELD),
      })
      .when('location', {
        is: 'onSiteOrRemote',
        then: Yup.string().required(REQUIRED_FIELD),
      }),

    geoRestriction: Yup.array()
      .nullable(true)
      .max(4, 'Max 4 Geographic restrictions allowed'),
    geoRestrictionOther: Yup.string().when(
      'geoRestriction',
      (geoRestriction) => {
        return geoRestriction && geoRestriction.includes('Other')
          ? Yup.string().required(REQUIRED_FIELD)
          : Yup.string();
      }
    ),
  }),
  salary: Yup.object().shape({
    currency: Yup.string(),
    period: Yup.string(),
    min: Yup.string(),
    max: Yup.string(),
  }),
  applicationMethod: Yup.string().required(REQUIRED_FIELD),
  apply: Yup.string()
    .when('applicationMethod', {
      is: 'email',
      then: Yup.string().email('invalid email').required(REQUIRED_FIELD),
    })
    .when('applicationMethod', {
      is: 'website',
      then: Yup.string()
        .matches(
          VALID_URL,
          'URL is not valid, try this format: website.com/apply'
        )
        .required(REQUIRED_FIELD),
    }),
  email: Yup.string()
    .required(REQUIRED_FIELD)
    .email('Email is invalid, maybe it contains spaces?'),
  companyData: Yup.object().shape({
    name: Yup.string()
      .min(2, MIN_2_CHARACTERS)
      .matches(
        ALPHANUMERIC_AND_SPECIFIC_CHARS && NO_BACKWARD_SLASH,
        CHARACTERS_NOT_ALLOWED
      )
      .required(REQUIRED_FIELD),
    website: Yup.string().matches(VALID_URL, {
      message: 'URL is not valid, try this format: website.com',
      excludeEmptyString: true,
    }),
  }),
  sdgtext1: Yup.string().required('req'),
  sdg: Yup.array()
    .min(1, 'At least one SDG is required')
    .max(5, 'Max 5 SDGs allowed')
    .of(Yup.string().required('At least one SDG is required'))
    .required('At least one SDG is required')
    .nullable(false)
    .typeError('At least one SDG is required'),
  // .of(Yup.object({ id: Yup.string(), text: Yup.string() })),
  // sdg: Yup.array().required('req').min(1, 'required').of(Yup.object()),
});
