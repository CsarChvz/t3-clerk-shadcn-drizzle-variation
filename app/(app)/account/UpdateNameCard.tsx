"use client";

import { AccountCard, AccountCardFooter, AccountCardBody } from "./AccountCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function UpdateNameCard({ name }: { name: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newName = formData.get("name") as string;

    if (newName.length < 3) {
      toast.error("Name must be longer than 3 characters.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/account", {
          method: "PUT",
          body: JSON.stringify({ name: newName }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast.success("Successfully updated name!");
        router.refresh();
      } catch (error) {
        console.error("Update failed:", error); // Usamos el error aquí
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update name. Please try again."
        );
      }
    });
  };

  return (
    <AccountCard
      params={{
        header: "Your Name",
        description:
          "Please enter your full name, or a display name you are comfortable with.",
      }}
    >
      <form onSubmit={handleSubmit}>
        <AccountCardBody>
          <Input
            defaultValue={name}
            name="name"
            disabled={isPending}
            minLength={3}
            maxLength={64}
            required
          />
        </AccountCardBody>
        <AccountCardFooter description="64 characters maximum">
          <Button type="submit" disabled={isPending} aria-disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">↻</span>
                Updating...
              </div>
            ) : (
              "Update Name"
            )}
          </Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}