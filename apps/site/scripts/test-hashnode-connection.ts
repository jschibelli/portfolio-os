/**
 * Test script to verify Hashnode API connection
 * This script tests the connection to Hashnode and retrieves blog posts
 * 
 * Usage:
 *   cd apps/site
 *   npx tsx scripts/test-hashnode-connection.ts
 */

const HASHNODE_HOST = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || 'mindware.hashnode.dev';
const GQL_ENDPOINT = 'https://gql.hashnode.com/';

interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  brief: string;
  publishedAt: string;
}

async function testHashnodeConnection() {
  console.log('🔍 Testing Hashnode API Connection...\n');
  console.log(`Publication Host: ${HASHNODE_HOST}`);
  console.log(`GraphQL Endpoint: ${GQL_ENDPOINT}\n`);

  // Test 1: Fetch publication info
  console.log('📊 Test 1: Fetching publication info...');
  const publicationQuery = `
    query Publication($host: String!) {
      publication(host: $host) {
        id
        title
        displayTitle
        url
        posts(first: 0) {
          totalDocuments
        }
      }
    }
  `;

  try {
    const pubResponse = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: publicationQuery,
        variables: { host: HASHNODE_HOST }
      }),
    });

    const pubData = await pubResponse.json();
    
    if (pubData.errors) {
      console.error('❌ Publication query failed:');
      console.error(JSON.stringify(pubData.errors, null, 2));
      return;
    } else if (pubData.data?.publication) {
      console.log('✅ Publication found!');
      console.log(`   Title: ${pubData.data.publication.title}`);
      console.log(`   URL: ${pubData.data.publication.url}`);
      console.log(`   Total Posts: ${pubData.data.publication.posts.totalDocuments}\n`);
    } else {
      console.log('⚠️ No publication found for this host');
      console.log('💡 Check NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST in .env.local\n');
      return;
    }
  } catch (error) {
    console.error('❌ Error fetching publication:', error);
    return;
  }

  // Test 2: Fetch blog posts
  console.log('📝 Test 2: Fetching blog posts...');
  const postsQuery = `
    query PostsByPublication($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              id
              title
              slug
              brief
              publishedAt
            }
          }
        }
      }
    }
  `;

  try {
    const postsResponse = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: postsQuery,
        variables: { host: HASHNODE_HOST, first: 10 }
      }),
    });

    const postsData = await postsResponse.json();
    
    if (postsData.errors) {
      console.error('❌ Posts query failed:');
      console.error(JSON.stringify(postsData.errors, null, 2));
    } else if (postsData.data?.publication?.posts?.edges) {
      const posts = postsData.data.publication.posts.edges.map((e: any) => e.node) as HashnodePost[];
      console.log(`✅ Found ${posts.length} posts!\n`);
      
      if (posts.length > 0) {
        console.log('📄 Available Posts:');
        posts.forEach((post, index) => {
          console.log(`   ${index + 1}. ${post.title}`);
          console.log(`      Slug: ${post.slug}`);
          console.log(`      URL: https://johnschibelli.dev/blog/${post.slug}\n`);
        });
      } else {
        console.log('⚠️ No posts published yet');
        console.log('💡 Publish some posts on Hashnode first\n');
      }
    } else {
      console.log('⚠️ No posts found\n');
    }
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return;
  }

  // Test 3: Test a specific post by slug
  if (process.argv[2]) {
    const testSlug = process.argv[2];
    console.log(`🔎 Test 3: Testing specific post "${testSlug}"...`);
    
    const postBySlugQuery = `
      query PostBySlug($host: String!, $slug: String!) {
        publication(host: $host) {
          post(slug: $slug) {
            id
            title
            slug
            brief
            publishedAt
          }
        }
      }
    `;

    try {
      const postResponse = await fetch(GQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: postBySlugQuery,
          variables: { host: HASHNODE_HOST, slug: testSlug }
        }),
      });

      const postData = await postResponse.json();
      
      if (postData.data?.publication?.post) {
        console.log(`✅ Found post: "${postData.data.publication.post.title}"`);
        console.log(`   URL: https://johnschibelli.dev/blog/${testSlug}\n`);
      } else {
        console.log(`❌ Post "${testSlug}" not found`);
        console.log('💡 Check the slug is correct\n');
      }
    } catch (error) {
      console.error('❌ Error fetching post:', error);
    }
  }

  console.log('✨ Connection test complete!\n');
  console.log('💡 Next Steps:');
  console.log('   1. Run: pnpm dev');
  console.log('   2. Visit: http://localhost:3000/blog');
  console.log('   3. Click on any post to verify it loads\n');
}

// Run the test
testHashnodeConnection().catch(console.error);

