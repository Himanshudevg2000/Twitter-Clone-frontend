import React, { useCallback, useState } from "react";
import { RiTwitterXFill } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { RiNotification2Line } from "react-icons/ri";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi2";
import { FaRegBookmark } from "react-icons/fa6";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "../../../clients/api";
import { verifyUserGoogleTokenQuery } from "../../../graphql/query/user";
import { useCurrentUser } from "../../../hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface TwitterLayoutProps {
  children: React.ReactNode;
}

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

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();

  const queryClient = useQueryClient();

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

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className=" col-span-2 sm:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
          <div>
            <div className="text-2xl h-fit w-fit hover:bg-slate-200 rounded-full p-4 cursor-pointer transition-all ">
              <RiTwitterXFill />
            </div>
            <div className="mt-1 text-xl pr-4">
              <ul>
                {sidebarMenuItems.map((items) => (
                  <li
                    className="flex justify-start items-center gap-4 text-xl hover:bg-gray-300 rounded-full px-3 py-3 w-fit cursor-pointer mt-2"
                    key={items.title}
                  >
                    <span>{items.icons}</span>
                    <span className="hidden sm:inline">{items.title}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-3">
                <button className="hidden sm:block bg-sky-500 font-semibold text-lg py-2 px-4 rounded-full w-full hover:bg-sky-600">
                  Post
                </button>

                <button className="block sm:hidden bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                  <RiTwitterXFill />
                </button>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="absolute bottom-5 flex gap-2 items-center bg-gray-300 px-3 py-2 rounded-full">
            {user && user.profileImageURL && (
              <Image
                className="rounded-full"
                src={user?.profileImageURL}
                alt="user-image"
                height={40}
                width={40}
              />
            )}
            <div className="hidden sm:block">
              <h3 className="text-xl">
                {user.firstName} {user.lastName}
              </h3>
              <span className="text-sm break-words">{user.email}</span>
            </div>
          </div>
        )}

        <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
          {props.children}
        </div>

        <div className="col-span-0 sm:col-span-3 p-5">
          {!user && (
            <div className="p-5 bg-gray-300 rounded-lg">
              <h1 className="my-2 text-2xl">New To X ?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
