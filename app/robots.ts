import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/gervis/", "/api/"],
    },
    sitemap: "https://ways-ci.com/sitemap.xml",
  };
}
