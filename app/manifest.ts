import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zendo - Intuition",
    short_name: "Zendo",
    description:
      "Welcome to Zendo. This is a upcoming startup aiming to make the world a better place for everyone to live in. Come, join us on our journey.",
    start_url: "/",
    display: "standalone",
    background_color: "#000409",
    theme_color: "#0a1820",
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
        name: "Contact Us",
        short_name: "Contact",
        url: "/contact",
        description: "Get in touch with us.",
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
        description: "View our blogs.",
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
        name: "About",
        short_name: "About",
        url: "/about",
        description: "Learn more about the startup.",
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
      "tech",
      "aarush",
      "master",
      "projects",
      "zendo",
      "zeal",
      "startup",
    ],
    id: `${process.env.NEXT_PUBLIC_APP_ID}`,
    lang: "en-US",
    dir: "ltr",
    orientation: "portrait",
  };
}
