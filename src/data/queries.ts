import gql from 'graphql-tag'

const HOME_ALL = gql`
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

const GET_POSTS = gql`
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

const GET_FAVORITES = gql`
    {
        favorites {
            title
        }
    }
`

export { HOME_ALL, GET_POSTS, GET_FAVORITES }
