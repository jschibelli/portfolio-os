// Import all the new components
import Hero from '../components/features/homepage/hero';
import Intro from '../components/features/homepage/intro';
import FeaturedProjects from '../components/features/portfolio/featured-projects';
import LatestPosts from '../components/features/blog/latest-posts';
import { Layout } from '../components/shared/layout';

export default function HomePage() {
  return (
    <Layout>
      <main id="main-content" role="main">
        <Hero />
        <Intro />
        <FeaturedProjects />
        <LatestPosts />
      </main>
    </Layout>
  );
}
