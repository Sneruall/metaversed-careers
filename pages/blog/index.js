import Link from 'next/link';
import groq from 'groq';
import client from '../../client';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/Header';
import LatestJobs from '../../components/LatestJobs';
import JobListing from '../../components/JobListing';
import { useNextSanityImage } from 'next-sanity-image';
import Footer from '../../components/Footer';
import BlogHero from '../../components/blog/BlogHero';
import BlogPosts from '../../components/blog/BlogPosts';
import { getJobsFromMongo } from '../../backend/job/jobDb';
import { JOB_EXPIRATION_TIME_MS } from '../../helpers/constants';
import JobItem from '../../components/JobItem';

// Todo: convert to typescript

const Index = ({ posts, jobs }) => {
  console.log(posts);

  const joblist = jobs?.map((job) => (
    <li className="list-none" key={job.id}>
      <JobItem job={job} />
    </li>
  ));

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>
          Explore how to make a positive impact with your job | Greendeed
        </title>
        <meta
          name="description"
          content="Explore our blogs about sustainability, sustainable development goals and how you can contribute with your job."
          key="desc"
        />
        <meta property="og:site_name" content="Greendeed" key="ogsitename" />
        <meta
          property="og:title"
          content="Explore how to make a positive impact with your job | Greendeed"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Explore our blogs about sustainability, sustainable development goals and how you can contribute with your job."
          key="ogdesc"
        />
        {/* Todo: add cool og:image */}
        {/* <meta
          property="og:image"
          content="https://example.com/images/cool-page.jpg"
        /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="mx-auto">
        {posts.length > 1 ? (
          <>
            <BlogHero latestPost={posts[1]} />
            <BlogPosts posts={posts} />
          </>
        ) : (
          <div className="site-margins my-32">
            Retrieving blog posts failed... Try again or{' '}
            <Link href="mailto:info@greendeed.io">
              <a className="font-bold text-custom-brown1">contact us</a>
            </Link>{' '}
            to report the issue, thanks!
          </div>
        )}
        <div className="site-margins mx-auto max-w-screen-xl">
          <h2 className="heading-xl mt-16 mb-10">
            Latest sustainable jobs on Greendeed
          </h2>
          <div className="flex flex-col gap-3">{joblist}</div>
          <div className="my-4 text-center">
            <Link href="/#jobs">
              <a>
                <button className="button-1">See all jobs</button>
              </a>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const posts = await client.fetch(groq`
      *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
    `);
  const millisecondsSince1970 = new Date().getTime();
  const jobs = await getJobsFromMongo(
    millisecondsSince1970 - JOB_EXPIRATION_TIME_MS,
    5
  );

  return {
    props: {
      posts,
      jobs: JSON.parse(JSON.stringify(jobs)),
    },
    revalidate: 60,
  };
}

export default Index;
