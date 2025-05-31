import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zendo - Intuition",
    short_name: "Zendo",
    description:
      "Welcome to Zendo. This is a private website for covering my work, projects, and portfolio. Let's explore the world of technology together.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "assets/icons/maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "assets/icons/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "assets/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "assets/icons/apple/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "assets/icons/apple/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "assets/icons/apple/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "assets/icons/apple/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "View Projects",
        short_name: "Projects",
        url: "/projects",
        description: "View Projects of mine.",
        icons: [
          {
            src: "assets/icons/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      {
        name: "Contact Me",
        short_name: "Contact",
        url: "/contact",
        description: "Get in touch with me.",
        icons: [
          {
            src: "assets/icons/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      {
        name: "View Blogs",
        short_name: "Blogs",
        url: "/blogs",
        description: "View Blogs of mine.",
        icons: [
          {
            src: "assets/icons/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      {
        name: "View Portfolio",
        short_name: "Portfolio",
        url: "/portfolio",
        description: "View Portfolio of mine.",
        icons: [
          {
            src: "assets/icons/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      {
        name: "About Me",
        short_name: "About",
        url: "/about",
        description: "Learn more about me.",
        icons: [
          {
            src: "assets/icons/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    ],
    categories: [
      "portfolio",
      "productivity",
      "technology",
      "aarush",
      "master",
      "projects",
      "zendo",
      "programming",
      "development",
      "design",
      "management",
    ],
    id: "c301e48c-ae4c-4061-b1f9-d4f64d85d4dc",
    lang: "en-US",
    dir: "ltr",
    orientation: "portrait",
  };
}
