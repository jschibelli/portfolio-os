import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import MinimalNav from '../components/minimal-nav';

interface Props {
  publication: any;
}

export default function MinimalTestPage({ publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>Minimal Test - {publication.displayTitle || publication.title}</title>
        </Head>
        
        <MinimalNav />
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
    descriptionSEO: 'Minimal test page',
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