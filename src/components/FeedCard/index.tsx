import Image from "next/image";
import React from "react";
import { TbMessageCircle2 } from "react-icons/tb";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";

const FeedCard = () => {
  return (
    <>
      <div className=" border border-r-0 border-l-0 border-gray-200 p-5 hover:bg-gray-200">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-1 rounded-full">
            <Image
              src="https://avatars.githubusercontent.com/u/103045944?v=4"
              alt="user-image"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div className="col-span-11">
            <div className="flex pb-2">
              <h2 className="text-lg font-bold">Himanshu Devgade</h2>
              <h3 className="text-sm">@himanshu</h3>
            </div>
            <p className="text-sm">
              12. On one hand, Rahul Gandhi and his INDI Alliance attacked PM
              Modi with a fake theory that Ambanis have a close tie with PM
              Modi. However, Rahul Gandhi and his INDI Alliance hide their
              direct relationship with Reliance and the Ambani family.
            </p>
          </div>
        </div>
        <div className=" ml-8 flex  justify-between text-xl px-4 pt-4 w-[90%]">
          <div>
            <TbMessageCircle2 />
          </div>
          <div>
            <AiOutlineRetweet />
          </div>
          <div>
            <CiHeart />
          </div>
          <div>
            <IoStatsChartSharp />
          </div>
          <div>
            <FaRegBookmark />
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedCard;
