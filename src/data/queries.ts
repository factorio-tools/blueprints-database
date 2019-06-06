import { gql } from 'apollo-boost';

export const HOME_ALL = gql`
    {
        posts {
            title
            author {
                firstName
                lastName
            }
        }
        favorites {
            title
        }
    }
`

export const GET_POSTS = gql`
    {
        posts {
            title
            author {
                firstName
                lastName
            }
        }
    }
`

export const GET_FAVORITES = gql`
    {
        favorites {
            title
        }
    }
`