"use client";
import React, { useCallback, useState } from "react";
import { RiTwitterXFill } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { RiNotification2Line } from "react-icons/ri";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi2";
import { FaRegBookmark } from "react-icons/fa6";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "../../clients/api";
import { verifyUserGoogleTokenQuery } from "../../graphql/query/user";
import { useCurrentUser } from "../../hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import { useCreateTweet, useGetAllTweets } from "../../hooks/tweet";

interface TwitterSideBarButton {
  title: string;
  icons: React.ReactNode;
}

const sidebarMenuItems: TwitterSideBarButton[] = [
  {
    title: "Home",
    icons: <GoHome />,
  },
  {
    title: "Explore",
    icons: <CiSearch />,
  },
  {
    title: "Notifications",
    icons: <RiNotification2Line />,
  },
  {
    title: "Message",
    icons: <MdOutlineLocalPostOffice />,
  },
  {
    title: "Bookmarks",
    icons: <FaRegBookmark />,
  },
  {
    title: "Profile",
    icons: <HiOutlineUser />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();

  const { mutate } = useCreateTweet();

  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google token not found`);

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Success");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

      await queryClient.invalidateQueries({
        queryKey: ["curent-user"],
      });
    },
    [queryClient]
  );

  const handleCreatePost = useCallback(() => {
    mutate({
      content,
    });
  }, [content, mutate]);

  return (
    <main>
      <div className="grid grid-cols-12 h-screen w-screen pl-36">
        <div className="col-span-2 pt-2 pr-4">
          <div className="text-3xl hover:bg-slate-200 rounded-full p-2 cursor-pointer transition-all w-fit">
            <RiTwitterXFill />
          </div>
          <div className="mt-4">
            <ul>
              {sidebarMenuItems.map((items) => (
                <li
                  className="flex justify-start items-center gap-4 text-xl hover:bg-gray-300 rounded-full px-4 py-2 w-fit cursor-pointer"
                  key={items.title}
                >
                  <span>{items.icons}</span>
                  <span>{items.title}</span>
                </li>
              ))}
            </ul>
            <div className=" p-4">
              <button className="bg-sky-500 py-3 cursor-pointer rounded-full text-white text-lg w-full hover:bg-sky-600">
                Post
              </button>
            </div>
          </div>
        </div>

        {user && (
          <div className="fixed bottom-5 left-[60px] flex gap-2 items-center p-2 rounded-full hover:bg-gray-200">
            {user && user.profileImageURL && (
              <Image
                className="rounded-full"
                src={user?.profileImageURL}
                alt="user-image"
                height={40}
                width={40}
              />
            )}
            <div>
              <h3 className="text-lg">
                {user.firstName} {user.lastName}
              </h3>
              <span className="text-sm break-words">{user.email}</span>
            </div>
          </div>
        )}

        <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600 ">
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
        <div className="col-span-3 p-2">
          {!user && (
            <div className="p-2 bg-gray-200 rounded-lg">
              <h1 className=" text-xl">New To X ?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
