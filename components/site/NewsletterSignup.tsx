"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const subscribeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type SubscribeValues = z.infer<typeof subscribeSchema>;

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: SubscribeValues) {
    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        setServerError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-center">
        <p className="text-base font-semibold text-emerald-800">
          You&apos;re on the list!
        </p>
        <p className="mt-1 text-sm text-emerald-700">
          Watch your inbox — the next issue is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email address"
          disabled={status === "submitting"}
          {...register("email")}
        />
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0"
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {errors.email ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {errors.email.message}
        </p>
      ) : null}
      {status === "error" && serverError ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {serverError}
        </p>
      ) : null}
    </form>
  );
}
