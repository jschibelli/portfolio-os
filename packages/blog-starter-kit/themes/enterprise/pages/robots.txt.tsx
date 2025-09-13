import { type GetServerSideProps } from 'next';

const RobotsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { res } = ctx;
	const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;
	if (!host) {
		throw new Error('Could not determine host');
	}

	const sitemapUrl = `https://${host}/sitemap.xml`;
	const robotsTxt = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Google adsbot ignores robots.txt unless specifically named!
User-agent: AdsBot-Google
Allow: /

# Allow Facebook crawler
User-agent: facebookexternalhit
Allow: /

# Allow Twitter crawler
User-agent: Twitterbot
Allow: /

# Allow LinkedIn crawler
User-agent: LinkedInBot
Allow: /

# Allow WhatsApp crawler
User-agent: WhatsApp
Allow: /

# Allow Telegram crawler
User-agent: TelegramBot
Allow: /

# Allow Pinterest crawler
User-agent: Pinterestbot
Allow: /

# Allow Discord crawler
User-agent: DiscordBot
Allow: /

# Block AI training crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

Sitemap: ${sitemapUrl}
  `.trim();

	res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
	res.setHeader('content-type', 'text/plain');
	res.write(robotsTxt);
	res.end();

	return { props: {} };
};

export default RobotsTxt;
