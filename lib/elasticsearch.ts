import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

export const searchStocks = async (query: string) => {
  const result = await client.search({
    index: 'stocks',
    query: {
      match: { name: query },
    },
  });
  return result.hits.hits;
};