"use client";

import { useEffect, useState } from "react";
import { AnalysisStatus } from "@/types/firestore";

export function useAnalysisDuration(status: AnalysisStatus | undefined) {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const startTimeStr = localStorage.getItem(`analysis_start`);
    if (!startTimeStr) return;

    const startTime = parseInt(startTimeStr, 10);
    const endTime = Date.now();
    const totalDurationSeconds = (endTime - startTime) / 1000;

    setDuration(totalDurationSeconds);
  }, [status]);

  return duration;
}

// export function useAnalysisDuration(
//   docId: string | undefined,
//   status: AnalysisStatus | undefined
// ) {
//   const [duration, setDuration] = useState<number | null>(null);

//   useEffect(() => {
//     if (!docId || status !== "completed") return;

//     const startTimeStr = localStorage.getItem(`analysis_start_${docId}`);
//     if (!startTimeStr) return;

//     const startTime = parseInt(startTimeStr, 10);
//     const endTime = Date.now();
//     const totalDurationSeconds = (endTime - startTime) / 1000;

//     setDuration(totalDurationSeconds);
//   }, [docId, status]);

//   return duration;
// }
