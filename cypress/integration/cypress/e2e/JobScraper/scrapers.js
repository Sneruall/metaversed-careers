/*
TODO:
- Better split out the config file based on tool (lever, cleanhub, wagestream, factorialhr), potentially create config files per system, and only specifying the tool once in the company config so it knows which selectors to use.import in config.ts en die dan importen in scaper.
- Ensure we don't include 'spontaneous applications etc, see fairmat examples
- Job removal if outdated (404, 301 etc) scraper maken.
- Run everything on localhost as test once. If it works out well enough, push to production.

- Add more jobs from the systems we already support (lever, factorialhr...)
- Update pricing page section so people can contact me: "Want to post regulary or several jobs at once? Contact me!"
- Error handling toevoegen, als job title of desscription niet gevonden is ('unknown'), niet submitten, maar een error throwen, zodat ik kan analyseren wat er is.
- Ensure we also check for pagination like we have on reformation job listing page

*/

import {
  cleanHTML,
  getTextFromLabel,
  extractSalaryData,
  getTextFromSelectors,
  getJobTypeFromSelectors,
  getHTMLFromSelectors,
  getTextFromMultipleSelectors,
} from '../../scripts/utils';
import { mapDepartmentToCategory } from '../../scripts/categories';
import { mapJobType } from '../../scripts/jobType';
import { checkJobExists, submitJob } from '../../scripts/jobUtilities';
import { mapLocation } from '../../scripts/location';
import { companyConfigs } from '../../config';

export const scrapeCompanyJobs = (companyKey) => {
  const companyConfig = companyConfigs[companyKey];
  const jobLinks = new Set(); // Use a Set to store unique job links
  const salaryRegex =
    /(?:£|US\$|€|CA\$|AU\$|\$|USD|EUR|GBP|CAD|AUD)?\s*(?:\d{1,3}(?:,\d{3})*|\d+)(?:\s*-\s*(?:£|US\$|€|CA\$|AU\$|\$|USD|EUR|GBP|CAD|AUD)?\s*(?:\d{1,3}(?:,\d{3})*|\d+))?(?:\s*(?:to|from|and)\s*(?:£|US\$|€|CA\$|AU\$|\$|USD|EUR|GBP|CAD|AUD)?\s*(?:\d{1,3}(?:,\d{3})*|\d+))?\s*(?:per\s*(?:year|annum|month|week|day|hour))?/i;

  const maxJobsPerCompany = 2 + Math.floor(Math.random() * 4); // Random number between 2 to 5
  let jobsAdded = 0; // Counter to keep track of jobs added

  cy.log(`Visiting company URL: ${companyConfig.url}`);
  cy.visit(companyConfig.url);
  cy.wait(5000); // Wait for the page to load fully

  const selectors = companyConfig.selectors || [];
  const jobDetailSelectors = companyConfig.jobDetails || {};

  // Loop through each selector and find job links
  cy.wrap(selectors).each((selector) => {
    if (jobsAdded >= maxJobsPerCompany) {
      cy.log(
        `Reached the limit of ${maxJobsPerCompany} jobs for company: ${companyConfig.name}`
      );
      return false; // Exit the loop if limit is reached
    }

    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.log(`Found elements for selector: ${selector}`);
        cy.get(selector, { timeout: 10000 }).each(($el) => {
          const jobLink = $el.attr('href');
          if (jobLink && jobsAdded < maxJobsPerCompany) {
            const fullJobLink = jobLink.startsWith('http')
              ? jobLink
              : `https://boards.greenhouse.io${jobLink}`;

            if (
              fullJobLink !== companyConfig.url &&
              !jobLinks.has(fullJobLink)
            ) {
              cy.log(`Found job link: ${fullJobLink}`);

              // Check if the job already exists
              checkJobExists({ apply: fullJobLink }).then((response) => {
                cy.log(`Checking if job exists at link: ${fullJobLink}`);
                if (response.status === 204 && jobsAdded < maxJobsPerCompany) {
                  cy.log(`Job link ${fullJobLink} is new. Adding to list.`);
                  jobLinks.add(fullJobLink); // Add unique job links to the Set
                  jobsAdded++; // Increment the counter
                } else {
                  cy.log(
                    `Job link ${fullJobLink} already exists. Status code was: ${response.status}`
                  );
                }

                // Check if we have reached the maximum jobs and exit the loop
                if (jobsAdded >= maxJobsPerCompany) {
                  cy.log(
                    `Reached the limit of ${maxJobsPerCompany} jobs. Stopping.`
                  );
                  return false; // Exit the inner loop
                }
              });
            } else {
              cy.log(
                `Job link ${fullJobLink} is either null, already included, or matches the listing page URL.`
              );
            }
          }
        });
      } else {
        cy.log(`No elements found for selector: ${selector}`);
      }
    });
  });

  cy.then(() => {
    cy.log(
      `Total unique job links found (note we have put a max on it): ${jobLinks.size}`
    );

    jobLinks.forEach((link) => {
      cy.log(`Visiting job detail page: ${link}`);
      cy.visit(link);
      cy.wait(3000); // Wait for the job page to load

      cy.document().then((doc) => {
        cy.log(`Extracting job details from: ${link}`);

        const jobDescriptionHTML =
          getHTMLFromSelectors(doc, jobDetailSelectors.jobDescription) ||
          'No description available';
        const cleanedJobDescription = cleanHTML(jobDescriptionHTML);
        const jobTitle =
          getTextFromSelectors(doc, jobDetailSelectors.jobTitle) ||
          'Unknown Title';
        const department =
          getTextFromLabel(doc, 'Department') ||
          getTextFromSelectors(doc, jobDetailSelectors.department) ||
          'Unknown Department';
        const departmentOrTitle =
          department !== 'Unknown Department' ? department : jobTitle;
        const mappedCategory = mapDepartmentToCategory(departmentOrTitle);
        const jobTypeText =
          getTextFromLabel(doc, 'Job Type') ||
          jobTitle ||
          getJobTypeFromSelectors(doc, jobDetailSelectors.jobType) ||
          'Unknown Job Type';
        const mappedJobType = mapJobType(jobTypeText);
        const salaryData = extractSalaryData(doc, salaryRegex);
        const locationSelectors = jobDetailSelectors.location || [];
        const locationText =
          getTextFromLabel(doc, 'Locations') ||
          getTextFromMultipleSelectors(doc, locationSelectors) ||
          'Unknown Location';
        const locationTypeString =
          getTextFromLabel(doc, 'Remote status') || null;
        const locationInfo = mapLocation(locationText, locationTypeString);

        // Prepare job data
        const jobData = {
          companyId: '',
          companyData: { name: companyConfig.name },
          jobTitle,
          category: mappedCategory,
          jobDescription: cleanedJobDescription,
          jobType: mappedJobType,
          salary: salaryData,
          locationInfo: locationInfo,
          email: 'l.c.vanroomen@gmail.com',
          fullName: 'Laurens van Roomen',
          timestamp: 0,
          id: '',
          paid: true,
          published: true,
          listed: true,
          closed: false,
          applicationMethod: 'website',
          apply: link,
          external: false,
          coupon: '',
          invoiceInfo: {},
        };

        cy.log(`Job data prepared: ${JSON.stringify(jobData)}`);

        // Check and submit the job
        submitJob(jobData);
      });
    });
  });
};
