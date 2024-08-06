"use client";
import React, { useCallback, useState } from "react";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "../../hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import { useCreateTweet, useGetAllTweets } from "../../hooks/tweet";
import TwitterLayout from "@/components/Layout/TwitterLayout";

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();

  const { mutate } = useCreateTweet();

  const [content, setContent] = useState("");

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

  const handleCreatePost = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);

  return (
    <main>
      <TwitterLayout>
        <div className=" sm:col-span-5 border-r-[1px] border-l-[1px] border-gray-600 ">
          <div>
            <div className=" border border-r-0 border-l-0 border-gray-200 p-5 hover:bg-gray-200">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1 rounded-full">
                  <Image
                    src={user?.profileImageURL as string}
                    alt="user-image"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div className="col-span-11">
                  <textarea
                    name="content"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className=" text-xl w-full bg-transparent px-3 border-b border-gray-200 "
                    placeholder="What is happening?!"
                    rows={3}
                  ></textarea>
                  <div className="mt-2 items-center flex justify-between">
                    <BiImageAlt
                      onClick={() => handleSelectImage()}
                      className="text-xl cursor-pointer hover:text-2xl"
                    />
                    <button
                      onClick={() => handleCreatePost()}
                      className="bg-[#1d9bf8] text-lg py-1 px-6 rounded-full text-white"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {tweets?.map((tweet: any) =>
            tweet ? <FeedCard key={tweet?.id} data={tweet} /> : null
          )}
        </div>
      </TwitterLayout>
    </main>
  );
}
