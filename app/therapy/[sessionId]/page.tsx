"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const SUGGESTED_QUESTIONS = [
  { text: "How can I manage my anxiety better?" },
  { text: "I've been feeling overwhelmed lately" },
  { text: "Can we talk about improving sleep?" },
  { text: "I need help with work-life balance" },
];

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function TherapyPage() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; timestamp: Date }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isTyping) return;

    const userMessage = {
      role: "user" as const,
      content: currentMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Fake AI reply
    setTimeout(() => {
      const assistantMessage = {
        role: "assistant" as const,
        content: getFakeResponse(currentMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const getFakeResponse = (input: string): string => {
    const responses = [
      "That’s completely understandable — it’s okay to feel that way sometimes.",
      "Let’s take a deep breath and talk through it calmly.",
      "Try focusing on small steps toward balance and self-care.",
      "You’re doing better than you think. Let’s explore what’s been stressing you lately.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestedQuestion = (text: string) => {
    setMessage(text);
    setTimeout(() => {
      const event = new Event("submit") as unknown as React.FormEvent;
      handleSubmit(event);
    }, 0);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
        {/* Sidebar */}
        <div className="w-80 flex flex-col border-r bg-muted/30">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat Sessions</h2>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              disabled
            >
              <MessageSquare className="w-4 h-4" />
              New Session (UI Only)
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <p className="text-muted-foreground text-sm text-center mt-10">
              Chat history disabled in frontend-only mode
            </p>
          </ScrollArea>
        </div>

  {/* Main Chat */}
  <div className="flex-1 flex flex-col overflow-hidden bg-[#091217] rounded-xl border border-primary/10 shadow-xl">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">AI Therapist</h2>
                <p className="text-sm text-muted-foreground">
                  {messages.length} messages
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="max-w-3xl w-full space-y-8">
                <div className="text-center space-y-4">
                  <div className="relative inline-flex flex-col items-center">
                    <motion.div
                      className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full"
                      initial={{ opacity: 0.5, scale: 1 }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.05, 1],
                        transition: { duration: 3, repeat: Infinity, ease: [0.42, 0, 0.58, 1] },
                      }}
                    />
                    <div className="relative flex items-center gap-3 text-3xl font-semibold">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <span className="bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                        AI Therapist
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2">How can I assist you today?</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {SUGGESTED_QUESTIONS.map((q, index) => (
                    <motion.div
                      key={q.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 + 0.3 }}
                    >
                      <button
                        onClick={() => handleSuggestedQuestion(q.text)}
                        className="w-full text-left rounded-2xl px-6 py-5 bg-[rgba(255,255,255,0.02)] border border-primary/8 hover:bg-[rgba(255,255,255,0.03)] transition-shadow duration-200 shadow-sm"
                      >
                        <div className="text-base font-medium text-foreground">{q.text}</div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scroll-smooth p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.timestamp.toISOString()}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "flex",
                        msg.role === "assistant" ? "justify-start" : "justify-end"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl p-4 max-w-[72%]",
                          msg.role === "assistant"
                            ? "bg-[rgba(255,255,255,0.02)] border border-primary/8 text-foreground"
                            : "bg-[rgba(255,255,255,0.03)] border border-secondary/10 text-foreground opacity-95"
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                            {msg.role === "assistant" ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-secondary" />}
                          </div>
                          <p className="font-medium text-sm">{msg.role === "assistant" ? "AI Therapist" : "You"}</p>
                        </div>
                        <div className="prose prose-sm dark:prose-invert leading-relaxed">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl p-4 max-w-[60%] bg-[rgba(255,255,255,0.02)] border border-primary/8 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">AI Therapist</p>
                        <p className="text-sm text-muted-foreground">Typing...</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t bg-background/50 backdrop-blur p-4">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto flex gap-4 items-end relative"
            >
              <div className="flex-1 relative group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className={cn(
                    "w-full resize-none rounded-2xl border bg-background p-3 pr-12 min-h-[48px]",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  )}
                  rows={1}
                  disabled={isTyping}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "absolute right-1.5 bottom-3.5 h-[36px] w-[36px] rounded-xl",
                    "bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20",
                    !message.trim() && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!message.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              Press <kbd className="px-2 py-0.5 rounded bg-muted">Enter ↵</kbd> to
              send,{" "}
              <kbd className="px-2 py-0.5 rounded bg-muted ml-1">
                Shift + Enter
              </kbd>{" "}
              for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
