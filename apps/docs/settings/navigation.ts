import { PageRoutes } from "@/lib/pageroutes"

export const Navigations = [
  {
    title: "Docs",
    href: `/docs${PageRoutes[0].href}`,
  },
  {
    title: "Portfolio",
    href: "https://joeschibelli.com",
    external: true,
  },
  {
    title: "Dashboard",
    href: "http://localhost:3000",
    external: true,
  },
]

export const GitHubLink = {
  href: "https://github.com/jschibelli/portfolio-os",
}
