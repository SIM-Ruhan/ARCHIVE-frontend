// Single source of truth for the ARCHIVE category tree.
// Used by the navbar (nested menu), browse filters, home page and the "add listing" form.
// category (level 1) -> group (level 2) -> item (level 3)
// Listings store the slugs: { category, subcategory, type }

export const CATEGORIES = [
  {
    slug: "social-media",
    name: "Social Media",
    blurb: "Accounts and audience for the major social platforms.",
    groups: [
      {
        slug: "facebook",
        name: "Facebook",
        items: [
          { slug: "facebook-account", name: "Facebook Account" },
          { slug: "facebook-follower", name: "Facebook Follower" },
        ],
      },
      {
        slug: "linkedin",
        name: "LinkedIn",
        items: [
          { slug: "linkedin-account-no-badge", name: "LinkedIn Account (without verify badge)" },
          { slug: "linkedin-account-verified", name: "LinkedIn Account (with verify badge)" },
          { slug: "linkedin-account-premium", name: "LinkedIn Account (with Premium)" },
          { slug: "linkedin-premium", name: "LinkedIn Premium" },
        ],
      },
      {
        slug: "reddit",
        name: "Reddit",
        items: [
          { slug: "reddit-empty-account", name: "Reddit Empty Account" },
          { slug: "reddit-karma-account", name: "Reddit Karma Account" },
        ],
      },
      {
        slug: "twitter-x",
        name: "Twitter / X",
        items: [
          { slug: "twitter-account-followers", name: "Twitter Account with Followers" },
          { slug: "twitter-account-verified", name: "Twitter Account with Verified Badge" },
          { slug: "twitter-post-impression", name: "Twitter Post Impression" },
          { slug: "twitter-post-like-comment", name: "Twitter Post Like and Comment" },
        ],
      },
      {
        slug: "tiktok",
        name: "TikTok",
        items: [
          { slug: "tiktok-follower", name: "TikTok Follower" },
          { slug: "tiktok-account", name: "TikTok Account" },
        ],
      },
      {
        slug: "gmail",
        name: "Gmail",
        items: [
          { slug: "new-gmail", name: "New Gmail" },
          { slug: "old-gmail", name: "Old Gmail" },
        ],
      },
      { slug: "google-voice", name: "Google Voice", items: [] },
    ],
  },
  {
    slug: "games",
    name: "Games",
    blurb: "Game launcher accounts and game accounts.",
    groups: [
      { slug: "game-launcher-accounts", name: "Game Launcher Accounts", items: [] },
      { slug: "game-accounts", name: "Games", items: [] },
    ],
  },
  {
    slug: "marketplace",
    name: "Marketplace Accounts",
    blurb: "Seller and storefront accounts on online marketplaces.",
    groups: [],
  },
];

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const getGroup = (categorySlug, groupSlug) =>
  getCategory(categorySlug)?.groups.find((g) => g.slug === groupSlug);

export const getItem = (categorySlug, groupSlug, itemSlug) =>
  getGroup(categorySlug, groupSlug)?.items.find((i) => i.slug === itemSlug);

// Human readable label for a stored listing ("Social Media / Facebook / Facebook Account")
export const labelFor = ({ category, subcategory, type } = {}) => {
  const parts = [
    getCategory(category)?.name,
    getGroup(category, subcategory)?.name,
    getItem(category, subcategory, type)?.name,
  ].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Uncategorized";
};

// Build a /browse URL for any level of the tree
export const browseHref = ({ category, subcategory, type } = {}) => {
  const p = new URLSearchParams();
  if (category) p.set("category", category);
  if (subcategory) p.set("subcategory", subcategory);
  if (type) p.set("type", type);
  const qs = p.toString();
  return qs ? `/browse?${qs}` : "/browse";
};
