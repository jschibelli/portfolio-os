import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import RadixNav from '../components/radix-nav';

interface Props {
  publication: any;
}

export default function RadixTestPage({ publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>Radix Test - {publication.displayTitle || publication.title}</title>
        </Head>
        
        <RadixNav />
      </Layout>
    </AppProvider>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const publication: any = {
    title: 'Enterprise Blog',
    displayTitle: 'Enterprise Blog',
    url: 'https://example.com',
    logo: null,
    author: { name: 'Enterprise Team' },
    descriptionSEO: 'Radix test page',
    ogMetaData: {
      image: 'https://via.placeholder.com/1200x630',
    },
    preferences: {
      disableFooterBranding: false,
      logo: null,
      darkMode: false,
    },
    isTeam: false,
    imprint: null,
    features: {
      tableOfContents: { isEnabled: true },
      newsletter: { isEnabled: true },
      readMore: { isEnabled: true },
    },
  };

  return {
    props: {
      publication,
    },
    revalidate: 1,
  };
}; 