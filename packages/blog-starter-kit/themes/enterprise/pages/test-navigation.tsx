import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Layout } from '../components/layout';
import NavigationDemo from '../components/navigation-demo';
import ModernHeader from '../components/modern-header';
import SimpleHeader from '../components/simple-header';
import WorkingHeader from '../components/working-header';

interface Props {
  publication: any;
}

export default function TestNavigationPage({ publication }: Props) {
  return (
    <AppProvider publication={publication}>
      <Layout>
        <Head>
          <title>Test Navigation - {publication.displayTitle || publication.title}</title>
        </Head>
        <ModernHeader publication={publication} />
        
        <Container className="py-16">
          <h1 className="text-4xl font-bold mb-8">Navigation Test Page</h1>
          <p className="text-lg mb-4">This page is to test the navigation menu functionality.</p>
          <p className="text-muted-foreground">
            Try hovering over the &quot;Services&quot; menu item in the navigation to see if the dropdown works.
          </p>
        </Container>
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
    descriptionSEO: 'Test page for navigation',
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