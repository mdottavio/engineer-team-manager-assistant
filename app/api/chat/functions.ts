import { generateRemotersCheckins } from "@/app/lib/notion/checkins";
import { getExtraNotesReport } from "@/app/lib/notion/extra-data";
import { generateManagerFeedback } from "@/app/lib/notion/manager-feedback";
import { generateCustomersDetails } from "@/app/lib/remotely";

export async function generateCustomerReport(customerId: number) {
  if (!customerId) {
    return "No customer id provided";
  }
  const { result: customerDetails } = await generateCustomersDetails(
    customerId,
  );
  return customerDetails;
}
export async function generateExtraNotesReport(
  customerId: number,
  startDate: string,
  endDate: string,
) {
  if (!customerId) {
    return "No customer id provided";
  }
  const { result: customerDetails } = await getExtraNotesReport(
    customerId,
    startDate,
    endDate,
  );
  return customerDetails;
}
export async function generateCheckinsReport(
  customerId: number,
  startDate: string,
  endDate: string,
) {
  if (!customerId) {
    return "No customer id provided";
  }
  const { result: customerDetails, customer } = await generateCustomersDetails(
    customerId,
  );

  const { result: checkins } = await generateRemotersCheckins(
    customerId,
    startDate,
    endDate,
  );

  const { result: managerFeedback } = await generateManagerFeedback(
    customer.company_name,
    startDate,
    endDate,
  );

  const result = `
${customerDetails}

${checkins}

${managerFeedback}

`;
  return { result };
}

export async function runFunction(name: string, args: any) {
  console.log(`Running function ${name} with args: ${JSON.stringify(args)}`);
  switch (name) {
    case "getCustomerDetails":
      return await generateCustomerReport(args["customerId"]);
    case "getExtraData":
      return await generateExtraNotesReport(
        args["customerId"],
        args["startDate"],
        args["endDate"],
      );
    case "getFeedback":
      return await generateCheckinsReport(
        args["customerId"],
        args["startDate"],
        args["endDate"],
      );
    default:
      return null;
  }
}
