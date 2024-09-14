import { getRemotersCheckins } from "@/app/lib/notion";
import { searchCustomersDetails } from "@/app/lib/remotely";

async function getCustomerDetails(customerId: number) {
  try {
    const details = await searchCustomersDetails(customerId);
    return details;
  } catch (error) {
    throw new Error(
      `Failed to get customer details: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

async function getFeedback(
  customerId: number,
  startDate: string,
  endDate: string,
) {
  const customerDetails = await getCustomerDetails(customerId);
  const checkins = await getRemotersCheckins(customerId, startDate, endDate);

  const result = `
${customerDetails}

${checkins}
`;
  return result;
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "getCustomerDetails":
      return await getCustomerDetails(args["customerId"]);
    case "getFeedback":
      return await getFeedback(
        args["customerId"],
        args["startDate"],
        args["endDate"],
      );
    default:
      return null;
  }
}
