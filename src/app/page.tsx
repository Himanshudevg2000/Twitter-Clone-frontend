"use client";
import React, { useCallback } from "react";
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
  const queryClient = useQueryClient();

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) {
        return toast.error(`Google token not found`);
      }
      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        {
          token: googleToken,
        }
      );
      console.log("verifyGoogleToken: ", verifyGoogleToken);

      toast.success("Verified Success");
      console.log(verifyGoogleToken);
      if (verifyGoogleToken) {
        window.localStorage.setItem("_twitter_token", verifyGoogleToken);
      }

      // await queryClient.invalidateQueries(["current-user"]);
      await queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
    },
    [queryClient]
  );
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
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-image"
                  height={50}
                  width={50}
                />
              )}
              <div>
                <h3 className="text-xl">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
            </div>
          )}

        <div className="col-span-5 border-r-[1px] border-l-[1px] border-gray-600 ">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
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
