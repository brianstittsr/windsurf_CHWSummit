"use client";

import { SurveyProvider } from "@/context/SurveyContext";
import SurveyContainer from "@/components/SurveyContainer";

export default function Home() {
  return (
    <SurveyProvider>
      <SurveyContainer />
    </SurveyProvider>
  );
}
