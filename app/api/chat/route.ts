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
  const additional_instructions = `The user's customerId is ${customerId} (numeric), use it to obtain information about the team and company they are referring to.
The user's time is ${now}, use it as reference.
${name ? `Please address the user as ${name}. ${userRole}` : ""}
`;
  console.log(additional_instructions);
  const run = await openai.beta.threads.runs.create(thread.id, {
    model: "gpt-4-turbo",
    assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    additional_instructions,
    // stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Get initial response from assistant
      const initialResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Provide a brief, one-sentence acknowledgment of the user's question and indicate that you'll be searching for information.",
          },
          { role: "user", content: messages[messages.length - 1].content },
        ],
        max_tokens: 50,
      });

      const initialMessage =
        initialResponse.choices[0].message.content ||
        "Let me search some data to answer your question...";
      controller.enqueue(encoder.encode(initialMessage));

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

      const messagesResult = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messagesResult.data.find(
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
