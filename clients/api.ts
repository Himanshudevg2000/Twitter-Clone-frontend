// import { GraphQLClient } from "graphql-request";

// const isClient = typeof window !== "undefined";

// const getHeaders = () => {
//   const token = isClient ? window.localStorage.getItem("__twitter_token") : "";
//   const headers: Record<string, string> = {};

//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }

//   return headers;
// };

// export const graphqlClient = new GraphQLClient("http://localhost:8000/graphql", {
//   headers: getHeaders
// });

// import { GraphQLClient } from "graphql-request";

// const isClient = typeof window !== "undefined";

// const headers: Record<string, string> = {};
// if (isClient) {
//   const token = window.localStorage.getItem("__twitter_token");
//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }
// }

// export const graphqlClient = new GraphQLClient("http://localhost:8001/graphql", {
//   headers,
// });

import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
  "http://localhost:8001/graphql",
  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("__twitter_token")}`
        : "",
    }),
  }
);