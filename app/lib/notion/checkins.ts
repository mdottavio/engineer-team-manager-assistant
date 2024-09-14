import { notionPostRequest } from "./client";
import {
  NormalizedCheckin,
  NotionAsyncCheckin,
  NotionSyncCheckin,
} from "./types";

const parseAsyncCheckin = (
  checkin: NotionAsyncCheckin,
): NormalizedCheckin | null => {
  return {
    checkinType: "Async videoask",
    remoter: checkin.properties.Name.title[0]?.plain_text || "",
    instance: `${checkin.properties.instance.number} days`,
    manager: checkin.properties["manager name"].rich_text[0]?.plain_text || "",
    date: checkin.properties.date.date.start.split("T")[0],
    tone: checkin.properties.tone.select.name,
    summary: checkin.properties.sumarization.rich_text[0]?.plain_text || "",
    quote: checkin.properties.quote.rich_text[0].plain_text || "",
  };
};

const parseSyncCheckin = (checkin: NotionSyncCheckin): NormalizedCheckin => {
  return {
    checkinType: "Interview",
    remoter: checkin.properties.Name.title[0]?.plain_text || "",
    instance: `${checkin.properties.instance.number} days`,
    manager: checkin.properties["manager name"].rich_text[0]?.plain_text || "",
    date: checkin.properties.date.date.start.split("T")[0],
    summary: checkin.properties.sumarization.rich_text[0]?.plain_text || "",
  };
};

const getCheckins = async (
  dbId: string,
  customerId: number,
  startDate: string,
  endDate: string,
) => {
  const body = {
    filter: {
      and: [
        {
          property: "customer id",
          number: {
            equals: parseInt(`${customerId}`),
          },
        },
        {
          property: "date",
          date: {
            on_or_after: startDate,
          },
        },
        {
          property: "date",
          date: {
            on_or_before: endDate,
          },
        },
      ],
    },
  };
  const { results } = await notionPostRequest(`/databases/${dbId}/query`, body);
  return results;
};

const generateRemotersCheckins = async (
  customerId: number,
  startDate: string,
  endDate: string,
) => {
  const checkins = [];
  const asyncCheckins = await getCheckins(
    process.env.NOTION_ASYNC_CHECKINS_DATABASE_ID!,
    customerId,
    startDate,
    endDate,
  );
  checkins.push(
    ...asyncCheckins.map((checkin: any) => parseAsyncCheckin(checkin)),
  );
  const syncCheckins = await getCheckins(
    process.env.NOTION_SYNC_CHECKINS_DATABASE_ID!,
    customerId,
    startDate,
    endDate,
  );
  checkins.push(
    ...syncCheckins.map((checkin: any) => parseSyncCheckin(checkin)),
  );

  const result = `
## Engineering feedback
${checkins
  .map(
    (checkin: NormalizedCheckin) => `
Remoter: ${checkin.remoter}

Check-in: ${checkin.instance}

Check-in type: ${checkin.checkinType}

Manager: ${checkin.manager}

Check-in date: ${checkin.date}

${checkin.tone ? `Check-in Tone: ${checkin.tone}` : ""}

Summarization:
${checkin.summary}

${checkin.quote ? `Quote: "${checkin.quote}"` : ""}
  `,
  )
  .join("\n---\n")}
`;
  return { result };
};

export { generateRemotersCheckins };
