"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ToolPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct page
    router.push("/tools");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Redirecting to Tools page...</p>
      </div>
    </div>
  );
}
