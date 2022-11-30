import Link from 'next/link';
import groq from 'groq';
import client from '../../client';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/Header';
import JobListing from '../../components/JobListing';
import { useNextSanityImage } from 'next-sanity-image';
import Footer from '../../components/Footer';
import BlogHero from '../../components/blog/BlogHero';
import BlogPosts from '../../components/blog/BlogPosts';
import { getJobsFromMongo } from '../../backend/job/db';

// Todo: convert to typescript

const Index = ({ posts, jobs }) => {
  console.log(posts);

  return (
    <>
      <Head>
        <title>Greendeed Blog</title>
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
        <div className="site-margins">
          <h2 className="heading-xl mt-16 mb-10">
            Latest sustainable jobs on Greendeed
          </h2>
          <JobListing page={1} resultsPerPage={3} jobs={jobs} />
          <div className="text-center">
            <Link href="/#jobs">
              <a>
                <button className="button-1">See all jobs</button>
              </a>
            </Link>
          </div>
        </div>
      </main>
      {/* Latest jobs section */}
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const posts = await client.fetch(groq`
      *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
    `);
  const jobs = await getJobsFromMongo(3);

  return {
    props: {
      posts,
      jobs: JSON.parse(JSON.stringify(jobs)),
    },
    revalidate: 60,
  };
}

export default Index;
