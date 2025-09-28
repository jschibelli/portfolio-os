// Mock GraphQL types for testing
export interface PublicationFragment {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon: string;
  logo: string;
  isTeam: boolean;
  metaTags?: string;
  links?: {
    [key: string]: string;
  };
  integrations?: {
    googleAnalyticsID?: string;
    hotjarID?: string;
    mixpanelID?: string;
    fathomAnalyticsID?: string;
    plausibleAnalyticsDomain?: string;
    posthogAnalyticsID?: string;
    umamiWebsiteID?: string;
    facebookPageID?: string;
    facebookPageAccessToken?: string;
    twitterHandle?: string;
    instagramHandle?: string;
    linkedinCompanyID?: string;
    youtubeChannelID?: string;
    githubHandle?: string;
    discordInviteCode?: string;
    slackCommunityID?: string;
    telegramChannelHandle?: string;
    mastodonHandle?: string;
    bskyHandle?: string;
    pinterestHandle?: string;
    tiktokHandle?: string;
    snapchatHandle?: string;
    redditHandle?: string;
    mediumHandle?: string;
    substackHandle?: string;
    ghostPublicationID?: string;
    buttondownAPIKey?: string;
    convertkitAPIKey?: string;
    emailOctopusAPIKey?: string;
    klaviyoAPIKey?: string;
    mailchimpAPIKey?: string;
    revueAPIKey?: string;
    beehiivAPIKey?: string;
    mailerliteAPIKey?: string;
    sendfoxAPIKey?: string;
    koalaPublicKey?: string;
    msClarityID?: string;
    matomoURL?: string;
    matomoSiteID?: string;
    fathomCustomDomain?: string;
    fathomCustomDomainEnabled?: boolean;
    plausibleAnalyticsEnabled?: boolean;
    gTagManagerID?: string;
  };
  preferences: {
    logo: string;
    darkMode: {
      logo: string;
    };
    navbarItems: any[];
    layout: {
      navbarStyle: string;
      footerStyle: string;
      showBranding: boolean;
    };
    members: any[];
  };
}

export interface PostFragment {
  id: string;
  title: string;
  slug: string;
  brief: string;
  publishedAt: string;
  coverImage: {
    url: string;
  };
  author: {
    id: string;
    name: string;
    username: string;
    profilePicture: string;
  };
}

export interface User {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
}

export interface Comment {
  id: string;
  content: {
    html: string;
    markdown: string;
  };
  author: User;
  publishedAt: string;
  totalReactions: number;
}

export interface PostFullFragment {
  id: string;
  title: string;
  slug: string;
  content: {
    html: string;
    text: string;
    markdown: string;
  };
  publishedAt: string;
  updatedAt: string;
  coverImage: {
    url: string;
  };
  author: {
    id: string;
    name: string;
    username: string;
    profilePicture: string;
  };
  publication: PublicationFragment;
  coAuthors?: Array<{
    id: string;
    name: string;
    username: string;
    profilePicture: string;
  }>;
  tags?: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  comments: {
    edges: Array<{
      node: Comment;
    }>;
    totalDocuments: number;
  };
  features: {
    tableOfContents: {
      items: Array<{
        id: string;
        title: string;
        slug: string;
        level: number;
        parentId?: string;
      }>;
    };
  };
  readTimeInMinutes: number;
  preferences: {
    disableComments: boolean;
  };
}

export interface StaticPageFragment {
  id: string;
  title: string;
  slug: string;
  content: {
    html: string;
    text: string;
  };
  publishedAt: string;
  updatedAt: string;
}

export interface PostsByPublicationQuery {
  publication: {
    posts: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          slug: string;
          publishedAt: string;
          coverImage: {
            url: string;
          };
          author: {
            name: string;
            profilePicture: string;
          };
        };
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
}

export interface SeriesPostsByPublicationQuery {
	publication: {
		seriesList: Array<{
			id: string;
			name: string;
			slug: string;
			description: string;
			posts: {
				edges: Array<{
					node: {
						id: string;
						title: string;
						slug: string;
						publishedAt: string;
					};
				}>;
			};
		}>;
	};
}

export interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor?: string;
	endCursor?: string;
}

export interface SearchPostsOfPublicationQuery {
	searchPostsOfPublication: {
		edges: Array<{
			node: {
				id: string;
				title: string;
				slug: string;
				brief: string;
				coverImage: {
					url: string;
				};
			};
		}>;
	};
}

export interface SearchPostsOfPublicationQueryVariables {
	first: number;
	filter: {
		query: string;
		publicationId: string;
	};
	[key: string]: any;
}

export const SearchPostsOfPublicationDocument = '';

export interface PublicationNavbarItem {
	id: string;
	label: string;
	url: string;
	type: 'link' | 'page';
}

export interface SubscribeToNewsletterMutation {
	subscribeToNewsletter: SubscribeToNewsletterPayload;
}

export interface SubscribeToNewsletterMutationVariables {
	input: {
		email: string;
		publicationId: string;
	};
	[key: string]: any;
}

export interface SubscribeToNewsletterPayload {
	status: 'PENDING' | 'SUCCESS' | 'ERROR';
	message?: string;
}

export const SubscribeToNewsletterDocument = '';

// Additional exports needed for case study
export interface PostsByPublicationQueryVariables {
	first: number;
	host: string;
	[key: string]: any;
}

export const PostsByPublicationDocument = '';
