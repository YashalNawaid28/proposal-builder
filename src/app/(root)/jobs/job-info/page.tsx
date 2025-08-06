"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobInfoDialog } from "../../../../components/jobs/JobInfoDialog";
import { useAuth } from "../../../../components/supabase-auth-provider";

export default function JobInfoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const jobId = searchParams.get("id");
    if (jobId) {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/jobs");
  };

  return (
    <div>
      <JobInfoDialog
        isOpen={isOpen}
        onClose={handleClose}
        jobId={searchParams.get("id")}
      />
    </div>
  );
}
