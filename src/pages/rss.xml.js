import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { LANGUAJES } from "../consts";

const {
  ENGLISH: { SITE_TITLE, SITE_DESCRIPTION },
} = LANGUAJES;

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  });
}
