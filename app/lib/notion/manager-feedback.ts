import { notionPostRequest } from "./client";
import { Notion30DayFeedback, Notion60DayFeedback } from "./types";

const getManagerFeedbacks = async (
  dbId: string,
  customerName: string,
  startDate: string,
  endDate: string,
) => {
  const body = {
    filter: {
      and: [
        {
          property: "company",
          rich_text: {
            equals: customerName,
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

const generate30DaysFeedback = async (
  customerName: string,
  startDate: string,
  endDate: string,
): Promise<string[]> => {
  let result: string[] = [];
  const feedback30Days = await getManagerFeedbacks(
    process.env.NOTION_30_DAY_FEEDBACK_DATABASE_ID!,
    customerName,
    startDate,
    endDate,
  );
  result = [
    ...result,
    ...feedback30Days.map(
      (feedback: Notion30DayFeedback) => `
Manager: ${
        feedback.properties.hiring_manager_name.rich_text[0]?.plain_text || ""
      }

Remoter: ${feedback.properties.contractor_name.rich_text[0]?.plain_text || ""}

Check-in type: 30 days

Feedback date: ${feedback.properties.date.formula.date.start}

Manager feedback:
- Has ${
        feedback.properties.contractor_name.rich_text[0]?.plain_text || ""
      } met your expectations thus far? ${
        feedback.properties[
          "How would you evaluate your developer’s performance overall?"
        ].number
      } from 5
How would you evaluate ${
        feedback.properties.contractor_name.rich_text[0]?.plain_text || ""
      } on these topics?
 - Communication: ${feedback.properties.Communication.select.name}
 - Teamwork: ${feedback.properties.Teamwork.select.name}
 - Engagement: ${feedback.properties.Engagement.select.name}

Do you have any concerns so far? 
${feedback.properties.Comments.title[0]?.plain_text || ""}

 `,
    ),
  ];
  return result;
};

const generate60DaysFeedback = async (
  customerName: string,
  startDate: string,
  endDate: string,
): Promise<string[]> => {
  let result: string[] = [];
  const feedback30Days = await getManagerFeedbacks(
    process.env.NOTION_60_DAY_FEEDBACK_DATABASE_ID!,
    customerName,
    startDate,
    endDate,
  );
  result = [
    ...result,
    ...feedback30Days.map(
      (feedback: Notion60DayFeedback) => `
Manager: ${
        feedback.properties.hiring_manager_name.rich_text[0]?.plain_text || ""
      }

Remoter: ${feedback.properties.contractor_name.rich_text[0]?.plain_text || ""}

Check-in type: 60 days

Feedback date: ${feedback.properties.date.formula.date.start}

Manager feedback:
- How would you evaluate ${
        feedback.properties.contractor_name.rich_text[0]?.plain_text || ""
      }'s performance overall? ${
        feedback.properties[
          "How would you evaluate your developer’s performance overall?"
        ].number
      } from 5
- To what extent does ${
        feedback.properties.contractor_name.rich_text[0]?.plain_text || ""
      }'s seniority align with your expectations?  ${
        feedback.properties.seniority.number
      } from 5

How would you evaluate ${
        feedback.properties.contractor_name.rich_text[0]?.plain_text || ""
      } on these topics?
 - Communication: ${feedback.properties.Communication.select.name}
 - Proactiveness: ${feedback.properties.Proactiveness.select.name}
 - Engagement: ${feedback.properties.Engagement.select.name}
 - Autonomy: ${feedback.properties.Autonomy.select.name}
 - Teamwork: ${feedback.properties.Teamwork.select.name}

Do you wish to add any comments or specific feedback? 
${
  feedback.properties["Do you wish to add any comments or specific feedback?"]
    .rich_text[0]?.plain_text ||
  "" ||
  ""
}

`,
    ),
  ];
  return result;
};

const generateManagerFeedback = async (
  customerName: string,
  startDate: string,
  endDate: string,
) => {
  let result: string[] = [];
  await generate30DaysFeedback(customerName, startDate, endDate).then(
    (feedback) => (result = [...result, ...feedback]),
  );
  await generate60DaysFeedback(customerName, startDate, endDate).then(
    (feedback) => (result = [...result, ...feedback]),
  );

  // const feedback60Days = await getManagerFeedbacks(
  //   process.env.NOTION_60_DAY_FEEDBACK_DATABASE_ID!,
  //   customerName,
  //   startDate,
  //   endDate,
  // );
  // const feedback90Days = await getManagerFeedbacks(
  //   process.env.NOTION_90_DAY_FEEDBACK_DATABASE_ID!,
  //   customerName,
  //   startDate,
  //   endDate,
  // );
  // const feedback180Days = await getManagerFeedbacks(
  //   process.env.NOTION_180_DAY_FEEDBACK_DATABASE_ID!,
  //   customerName,
  //   startDate,
  //   endDate,
  // );
  // const feedback270Days = await getManagerFeedbacks(
  //   process.env.NOTION_270_DAY_FEEDBACK_DATABASE_ID!,
  //   customerName,
  //   startDate,
  //   endDate,
  // );
  return { result: result.join("\n --- \n") };
};

export { generateManagerFeedback };
