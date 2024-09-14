import { generateRemotersCheckins } from "@/app/lib/notion/checkins";
import { generateManagerFeedback } from "@/app/lib/notion/manager-feedback";
import { generateCustomersDetails, getCustomer } from "@/app/lib/remotely";

export async function generateReport(
  customerId: number,
  startDate: string,
  endDate: string,
) {
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
  switch (name) {
    case "getCustomerDetails":
      return await getCustomer(args["customerId"]);
    case "getFeedback":
      return await generateReport(
        args["customerId"],
        args["startDate"],
        args["endDate"],
      );
    default:
      return null;
  }
}
