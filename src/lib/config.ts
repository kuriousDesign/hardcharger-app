import { getLinks } from "./link-urls"

export const siteConfig = {
  name: "hardcharger/ui",
  url: "https://ui.shadcn.com",
  ogImage: "https://ui.shadcn.com/og.jpg",
  description:
    "a pick 'em game that makes watching spring car racing even more thrilling.",
  links: {
    twitter: "https://twitter.com/shadcn",
    kurious: "https://kurious-design.com",
    github: "https://github.com/kuriousDesign/hardcharger-app",
  },
  navItems: [
    {
      href: getLinks().getGamesUrl(),
      label: "Games",
    },
    {
      href: getLinks().getPlayerPicksUrl(),
      label: "Picks",
    },
    {
      href: "https://kurious-design.com",
      label: "Kurious",
    },

  ],
  adminNavItems: [
  { href: '/admin', label: 'Admin' },
  //{ href: getLinks().getUsersUrl(), label: 'Users' },
  { href: getLinks().getDriversUrl(), label: 'Drivers' },
]
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
