/**
 * Hashnode GraphQL Queries and Mutations
 */

export const CREATE_POST_MUTATION = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        title
        slug
        url
        publishedAt
        tags {
          id
          name
          slug
        }
        publication {
          id
          title
        }
      }
    }
  }
`;

export const UPDATE_POST_MUTATION = `
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      post {
        id
        title
        slug
        url
        content {
          markdown
        }
        updatedAt
        tags {
          id
          name
          slug
        }
      }
    }
  }
`;

export const DELETE_POST_MUTATION = `
  mutation RemovePost($input: RemovePostInput!) {
    removePost(input: $input) {
      post {
        id
      }
    }
  }
`;

export const SCHEDULE_POST_MUTATION = `
  mutation ScheduleDraft($input: ScheduleDraftInput!) {
    scheduleDraft(input: $input) {
      scheduledPost {
        id
        scheduledDate
      }
    }
  }
`;

export const GET_POST_QUERY = `
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      slug
      url
      content {
        markdown
      }
      publishedAt
      updatedAt
      tags {
        id
        name
        slug
      }
      series {
        id
        name
      }
    }
  }
`;

export const GET_PUBLICATION_QUERY = `
  query GetPublication($host: String!) {
    publication(host: $host) {
      id
      title
      url
      posts(first: 10) {
        edges {
          node {
            id
            title
            slug
            url
          }
        }
      }
    }
  }
`;

export const GET_TAGS_QUERY = `
  query GetTags($first: Int!) {
    tagCategories(first: $first) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

