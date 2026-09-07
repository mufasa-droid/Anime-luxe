import { algoliasearch, type SearchClient } from "algoliasearch";

let _algoliaClient: SearchClient | null = null;

function getAlgoliaClient(): SearchClient {
  if (_algoliaClient) return _algoliaClient;
  if (
    !process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ||
    !process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  ) {
    throw new Error(
      "Algolia isn't configured. Add NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_KEY to .env.local."
    );
  }
  _algoliaClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY // search-only key, safe for browser
  );
  return _algoliaClient;
}

export async function searchProducts(query: string) {
  const client = getAlgoliaClient();
  const { results } = await client.search({
    requests: [
      {
        indexName: "products",
        query,
        hitsPerPage: 8,
      },
    ],
  });
  return results[0];
}
