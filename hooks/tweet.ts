import toast from "react-hot-toast";
import { graphqlClient } from "../clients/api";
import { CreateTweetData } from "../gql/graphql";
import { createTweetMutation } from "../graphql/mutation/tweet";
import { getAllTweetsQuery } from "../graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateTweet = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphqlClient.request(createTweetMutation as any, { payload }),
    onMutate: (payload) => toast.loading("Creating Post", { id: "1" }),
    onSuccess: async() => {
      await queryClient.invalidateQueries({ queryKey: ["all-tweets"] });
      toast.success("Created Post", { id: "1" });
    },
  });

  return mutation;
};

export const useGetAllTweets = () => {
  const query = useQuery({
    queryKey: ["all-tweets"],
    queryFn: () => graphqlClient.request<any>(getAllTweetsQuery),
  });

  // return { ...query, tweets: query.data?.getAllTweets  };
  return { ...query, tweets: (query.data as any)?.getAllTweets };
};
