const CRYPTO_COMPARE_API_KEY = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;
const API_URL = "https://min-api.cryptocompare.com/data/v2";

export class NewsAPI {
  static async getLatestNews(categories: string[] = []): Promise<any[]> {
    const categoryParam = categories.length ? `&categories=${categories.join(",")}` : "";
    const response = await fetch(
      `${API_URL}/news/?lang=EN${categoryParam}&api_key=${CRYPTO_COMPARE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    return data.Data.map((item: any) => ({
      id: item.id,
      title: item.title,
      body: item.body,
      url: item.url,
      imageUrl: item.imageurl,
      source: item.source,
      categories: item.categories.split("|"),
      publishedAt: new Date(item.published_on * 1000).toISOString(),
    }));
  }
} 