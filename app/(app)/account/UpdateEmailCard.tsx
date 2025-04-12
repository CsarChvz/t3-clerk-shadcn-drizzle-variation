"use client";

import { AccountCard, AccountCardFooter, AccountCardBody } from "./AccountCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function UpdateEmailCard({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEmail = formData.get("email") as string;

    if (!newEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/account", {
          method: "PUT",
          body: JSON.stringify({ email: newEmail }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast.success(
          "Successfully updated email! Please check your inbox to verify."
        );
        router.refresh();
      } catch (error) {
        console.error("Email update failed:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update email. Please try again."
        );
      }
    });
  };

  return (
    <AccountCard
      params={{
        header: "Your Email",
        description:
          "Please enter the email address you want to use with your account.",
      }}
    >
      <form onSubmit={handleSubmit}>
        <AccountCardBody>
          <Input
            defaultValue={email}
            name="email"
            type="email"
            disabled={isPending}
            required
            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          />
        </AccountCardBody>
        <AccountCardFooter description="We will email you to verify the change.">
          <Button type="submit" disabled={isPending} aria-disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">↻</span>
                Updating...
              </div>
            ) : (
              "Update Email"
            )}
          </Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}
