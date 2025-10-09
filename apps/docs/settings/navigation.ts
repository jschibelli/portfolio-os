import { PageRoutes } from "@/lib/pageroutes"

export const Navigations = [
  {
    title: "Docs",
    href: `/docs${PageRoutes[0].href}`,
  },
  {
    title: "Portfolio",
    href: "https://johnschibelli.dev",
    external: true,
  },
  {
    title: "Dashboard",
    href: "https://dashboard.johnschibelli.dev",
    external: true,
  },
]

export const GitHubLink = {
  href: "https://github.com/jschibelli/portfolio-os",
}
