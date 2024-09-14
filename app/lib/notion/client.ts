const headers = new Headers();
headers.append("authorization", `Bearer ${process.env.NOTION_SECRET}`);
headers.append("Notion-Version", "2022-06-28");
headers.append("content-type", "application/json");

const NOTION_API_URL = "https://api.notion.com/v1";

export const notionPostRequest = async (path: string, body: any) => {
  const response = await fetch(`${NOTION_API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return response.json();
};
