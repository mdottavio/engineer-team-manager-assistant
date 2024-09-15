import OpenAI from "openai";
import { StreamingTextResponse } from "ai";
import { runFunction } from "./functions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, name, role, customerId } = await req.json();
  const userRole = role ? `Who is an ${role} at the startup.` : "";

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: messages[messages.length - 1].content,
  });

  const now = new Date().toString();
  const additional_instructions = `The user's customerId is ${customerId}, use it to obtain information about the team they are referring to.
Please address the user as ${name}. ${userRole}
Call 'getFeedback' to gain context about the startup's engineer team.
Catt 'getCustomerDetails' to gain context about the startup such us location, tech stack, etc.
The user's time is ${now}, use it as reference.`;
  console.log(additional_instructions);
  const run = await openai.beta.threads.runs.create(thread.id, {
    model: "gpt-4-turbo",
    assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    additional_instructions,
    // stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      async function waitForCompletion() {
        let runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id,
        );
        while (runStatus.status !== "completed") {
          if (runStatus.status === "requires_action") {
            const toolCalls =
              runStatus.required_action?.submit_tool_outputs.tool_calls;
            if (toolCalls) {
              const toolOutputs = await Promise.all(
                toolCalls.map(async (toolCall) => {
                  const result = await runFunction(
                    toolCall.function.name,
                    JSON.parse(toolCall.function.arguments),
                  );
                  return {
                    tool_call_id: toolCall.id,
                    output: JSON.stringify(result),
                  };
                }),
              );
              await openai.beta.threads.runs.submitToolOutputs(
                thread.id,
                run.id,
                {
                  tool_outputs: toolOutputs,
                },
              );
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
          runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id,
          );
        }
      }

      await waitForCompletion();

      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data.find(
        (message) => message.role === "assistant",
      );

      if (assistantMessage && assistantMessage.content[0].type === "text") {
        const text = assistantMessage.content[0].text.value;
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(text);
        controller.enqueue(uint8Array);
      }

      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}
