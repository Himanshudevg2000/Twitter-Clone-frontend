import { graphql } from "../../gql";
import { RequestDocument } from 'graphql-request';

export const getAllTweetsQuery = graphql(`#graphql
    query GetAllTweets {
        getAllTweets {
            id
            content
            imageURL
            author {
                firstName
                lastName
                profileImageURL
            }
        }
    } 
`) as unknown as RequestDocument;
