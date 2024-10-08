"use client";

import { useChat } from "ai/react";
import clsx from "clsx";
import { Bot, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import Textarea from "react-textarea-autosize";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import AuthWrapper from "./components/AuthWrapper";
import { LoadingCircle, LogoutButton, SendIcon } from "./icons";

const examples = [
  "Can you help me understand how my team is performed in the last 30 days?",
  "How did my team performed from April 1st to September 15th 2024?",
  "How many check-ins have you run with my team members during the last 30 days?",
  "Can you help me understand how my team performed? take the start date 04-01-2024 and en date 09-15-2024",
];

export default function Chat() {
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: (error) => {
      console.log(error);
    },
    body: {
      customerId: session?.user?.customerId,
      name: session?.user?.name,
      role: session?.user?.role,
    },
  });

  const disabled = isLoading || input.length === 0;

  const handleLogout = () => {
    signOut();
  };

  return (
    <AuthWrapper>
      <main className="flex flex-col items-center justify-between pb-40">
        <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
          <LogoutButton onClick={handleLogout} />
        </div>
        {messages.length > 0 ? (
          messages.map((message, i) => (
            <div
              key={i}
              className={clsx(
                "flex w-full items-center justify-center border-b border-gray-200 py-8",
                message.role === "user" ? "bg-white" : "bg-gray-100",
              )}
            >
              <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
                <div
                  className={clsx(
                    "p-1.5 text-white",
                    message.role === "assistant" ? "bg-green-500" : "bg-black",
                  )}
                >
                  {message.role === "user" ? (
                    <User width={20} />
                  ) : (
                    <Bot width={20} />
                  )}
                </div>
                <ReactMarkdown
                  className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // open links in new tab
                    a: (props) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        ) : (
          <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
            <div className="flex flex-col space-y-4 p-7 sm:p-10">
              <p className="text-gray-500">
                Welcome {session?.user.name}. Here are some examples of
                questions you can ask:
              </p>
            </div>
            <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
              {examples.map((example, i) => (
                <button
                  key={i}
                  className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                  onClick={() => {
                    setInput(example);
                    inputRef.current?.focus();
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
          >
            <Textarea
              ref={inputRef}
              tabIndex={0}
              required
              rows={1}
              autoFocus
              placeholder="Send a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  formRef.current?.requestSubmit();
                  e.preventDefault();
                }
              }}
              spellCheck={false}
              className="w-full pr-10 focus:outline-none"
            />
            <button
              className={clsx(
                "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                disabled
                  ? "cursor-not-allowed bg-white"
                  : "bg-gray-700 text-white hover:bg-gray-800",
              )}
              disabled={disabled}
            >
              {isLoading ? (
                <LoadingCircle />
              ) : (
                <SendIcon
                  className={clsx(
                    "h-4 w-4",
                    input.length === 0 ? "text-gray-300" : "text-white",
                  )}
                />
              )}
            </button>
          </form>
        </div>
      </main>
    </AuthWrapper>
  );
}
