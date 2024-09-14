import { generateManagerFeedback } from "@/app/lib/notion/manager-feedback";
import { generateReport } from "../chat/functions";

export async function POST(req: Request) {
  // const { result } = await generateReport(309, "2024-04-01", "2024-09-15");
  const { result } = await generateManagerFeedback(
    "PetScreening",
    "2024-04-01",
    "2024-09-15",
  );
  console.log(result);
  return new Response(result);
}
