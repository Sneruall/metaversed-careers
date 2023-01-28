import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { sdgList } from '../types/types';
import CategoryDropdown from './CategoryDropdown';
import SdgsFilter from './SdgsFilter';
import SearchInput from './SearchInput';

export const SearchBar = () => {
  return (
    // todo: consider prevent use of bg-[url] to exploit next image
    <div className="site-margins bg-[url('/images/main/bg-topo2x.png')] bg-cover bg-repeat pb-24">
      <div className="mx-auto max-w-4xl pt-24 sm:pt-32">
        <h2 className="heading-2xl mx-auto mb-6 max-w-2xl text-center leading-relaxed">
          Let's find your next Sustainable Job
        </h2>
      </div>
      <div className="mx-auto h-32 max-w-xl">
        <div className="flex h-full w-full text-center">
          <div className="flex-1"></div>
          <div id="search" className="relative h-full w-64 flex-initial">
            <Image
              src={'/images/home/finding-a-sustainable-job.png'}
              objectFit="contain"
              layout="fill"
            />
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="shadow-4 flex h-14 w-full items-center justify-center rounded-full bg-custom-green2 px-2 font-omnes font-semibold text-custom-brown4 sm:gap-2 sm:px-10">
          <SearchInput />
          <div className="mr-1 h-1/2 w-1 border-l border-black sm:mr-4"></div>
          <CategoryDropdown />
        </div>
      </div>
      <SdgsFilter />
    </div>
  );
};
