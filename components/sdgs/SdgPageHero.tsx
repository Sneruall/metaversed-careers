import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { sdgList } from '../../types/types';
import Tooltip from '../Tooltip';

type Props = {};

function SdgPageHero({}: Props) {
  return (
    <div className="site-margins">
      <div className="mx-auto max-w-6xl pt-24 sm:pt-32">
        <div>
          <h1 className="heading-xl mb-6 font-normal">
            Working for the Sustainable Development Goals
          </h1>
          <h2 className="heading-md-omnes2 font-light">
            By aligning with the SDGs, we ensure that the organizations and job
            positions featured on the platform are making meaningful
            contributions towards a sustainable future.{' '}
            <span className="hidden font-normal underline hover:text-custom-brown4 lg:inline">
              <Link href="#sdg1">Read more</Link>
            </span>{' '}
            <span className="underline hover:text-custom-brown4 lg:hidden">
              <Link href="#goals">Read more</Link>
            </span>{' '}
            about each goal and how you can make a difference with your job
            below.
          </h2>
        </div>
        <div className="my-10">
          <div className="my-4 grid grid-cols-1 gap-2 md:grid-cols-3 md:justify-center md:gap-8 lg:gap-16">
            <div className="">
              <h3 className="heading-sm-omnes3">For Sustainable Job Seekers</h3>
              <p className="font-century text-sm italic leading-relaxed text-custom-brown1">
                Greendeed gives you a comprehensive overview of sustainable job
                opportunities. With our unique labeling system based on the 17
                SDGs, you can easily find and apply for jobs with organizations
                that align with your values and interests. Say goodbye to the
                guesswork and hello to informed decisions about your desired
                impact. Start your journey with Greendeed now!
              </p>
            </div>
            <div className="my-4 text-center md:my-auto">
              <Image
                src="/images/sdgs/sdg-wheel.png"
                height={250}
                width={250}
                objectFit="contain"
                layout="intrinsic"
                alt="SDG Wheel"
              />
            </div>
            <div className="md:text-right">
              <h3 className="heading-sm-omnes3">For Sustainable Employers</h3>
              <p className="font-century text-sm italic leading-relaxed text-custom-brown1">
                Looking to attract top talent who share your values and mission?
                Greendeed connects you with job seekers who are passionate about
                sustainability. Our unique labeling system, based on the 17
                SDGs, makes it easy for you to target a highly engaged and
                relevant audience for your organization. Find ideal candidates
                via Greendeed now!
              </p>
            </div>
          </div>
          <div id="goals" className="my-10 lg:hidden">
            <div className="heading-sm-omnes2 mb-2 text-center">
              <h3>Which goals would you like to support with your job?</h3>
            </div>
            <div className="mx-4 flex max-w-6xl flex-wrap justify-center sm:mx-auto">
              {sdgList.map((sdg) => {
                return (
                  <Tooltip
                    textClassname=""
                    key={sdg.code}
                    className={`w-32 text-white ${
                      sdg.code == '1' && 'bg-custom-sdg1'
                    } ${sdg.code == '2' && 'bg-custom-sdg2'}  ${
                      sdg.code == '3' && 'bg-custom-sdg3'
                    } ${sdg.code == '4' && 'bg-custom-sdg4'} ${
                      sdg.code == '5' && 'bg-custom-sdg5'
                    } ${sdg.code == '6' && 'bg-custom-sdg6'} ${
                      sdg.code == '7' && 'bg-custom-sdg7'
                    } ${sdg.code == '8' && 'bg-custom-sdg8'} ${
                      sdg.code == '9' && 'bg-custom-sdg9'
                    } ${sdg.code == '10' && 'bg-custom-sdg10'} ${
                      sdg.code == '11' && 'bg-custom-sdg11'
                    } ${sdg.code == '12' && 'bg-custom-sdg12'} ${
                      sdg.code == '13' && 'bg-custom-sdg13'
                    } ${sdg.code == '14' && 'bg-custom-sdg14'} ${
                      sdg.code == '15' && 'bg-custom-sdg15'
                    } ${sdg.code == '16' && 'bg-custom-sdg16'} ${
                      sdg.code == '17' && 'bg-custom-sdg17'
                    }`}
                    iconClassName="text-main border-white"
                    position="top"
                    content={sdg.name}
                    title={
                      <button
                        key={sdg.code}
                        className="relative
                  mx-1 h-12 w-12 cursor-pointer border-2 border-gray-100 hover:scale-105 hover:border-custom-brown1"
                      >
                        <Link href={`#sdg${sdg.code}`} legacyBehavior>
                          <Image
                            src={`/images/icons/sdg-icons/${sdg.code}.png`}
                            objectFit="cover"
                            width="48"
                            height="48"
                            alt={sdg.name}
                          />
                        </Link>
                      </button>
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SdgPageHero;
