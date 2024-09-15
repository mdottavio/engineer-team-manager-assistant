import { getCustomer } from "../remotely";
import { notionPostRequest } from "./client";
import { NotionNote } from "./types";

const getNotes = async (
  customerName: string,
  startDate: string,
  endDate: string,
) => {
  const body = {
    filter: {
      and: [
        {
          property: "customer",
          title: {
            contains: customerName,
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
  const { results } = await notionPostRequest(
    `/databases/${process.env.NOTION_CUSTOMER_NOTES_DATABASE_ID}/query`,
    body,
  );
  return results;
};

const getExtraNotesReport = async (
  customerId: number,
  startDate: string,
  endDate: string,
) => {
  const customer = await getCustomer(customerId);
  const notes = await getNotes(customer.company_name, startDate, endDate);
  if (notes.length === 0) {
    return { result: "" };
  }

  const result = `
## Extra Notes for ${customer.company_name} - from ${startDate} to ${endDate}

${notes
  .map(
    (note: NotionNote) =>
      `- ${note.properties.date.date.start.split("T")[0]}: ${
        note.properties.tone.select.name
      } - ${note.properties.note.rich_text[0].plain_text}`,
  )
  .join("\n")}
`;
  return { result };
};

export { getExtraNotesReport };
