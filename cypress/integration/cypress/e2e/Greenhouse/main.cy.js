// main.cy.js

import { scrapeCompanyJobs } from './scrapers';

describe('Job Scraping Tests', () => {
  it('should scrape jobs for specific company', () => {
    scrapeCompanyJobs('lomi');
  });

  // Example: Running the scraper for multiple companies
  // ['apeel', 'reformation'].forEach((companyKey) => {
  //     scrapeCompanyJobs(companyKey);
  //   });
});
