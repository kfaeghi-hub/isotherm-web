export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Home",      href: "/" },
  { label: "Services",  href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About",     href: "/about" },
  { label: "Career",    href: "/career" },
  { label: "Contact",   href: "/contact" },
];

export const routes = {
  home:            "/",
  services:        "/services",
  serviceDetail:   (slug: string) => `/service/${slug}`,
  portfolio:       "/portfolio",
  portfolioDetail: (slug: string) => `/portfolio/${slug}`,
  about:           "/about",
  career:          "/career",
  careerDetail:    (slug: string) => `/career/${slug}`,
  contact:         "/contact",
} as const;

export const featureFlags = {
  blogEnabled:       false,
  newsletterEnabled: false,
} as const;

export const contact = {
  address: {
    street:   "95 Mural St., Suite 600",
    city:     "Richmond Hill",
    province: "ON",
    postal:   "L4B 3G2",
    country:  "Canada",
  },
  phone: "(905) 822-2430",
  email: "info@isothermengineering.com",
} as const;

export const siteConfig = {
  name:    "Isotherm Engineering",
  tagline: "Your Advocate for High Performance Buildings",
  url:     "https://isothermengineering.com",
  contact,
  nav:     navItems,
  routes,
  featureFlags,
} as const;
