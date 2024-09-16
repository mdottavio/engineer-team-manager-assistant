import { User } from "next-auth";
import { notionPostRequest } from "./client";
import { NotionUser } from "./types";

export async function getUserByEmail(email: string): Promise<User | null> {
  const response = await notionPostRequest(
    `/databases/${process.env.NOTION_USERS_DATABASE_ID}/query`,
    {
      filter: {
        and: [
          {
            property: "email",
            email: {
              equals: email,
            },
          },
        ],
      },
    },
  );
  console.log(response);
  if (response.results && response.results.length > 0) {
    const user: NotionUser = response.results[0];
    return {
      id: user.id,
      email: user.properties.email.email,
      name: user.properties.name.title[0].plain_text,
      role: user.properties.role.rich_text[0].plain_text,
      password: user.properties.password.rich_text[0].plain_text,
      customerId: user.properties.customerId.number,
    } as User;
  }

  return null;
}
