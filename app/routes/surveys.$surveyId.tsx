/**
 * Root component page for any route starting with /survey/[ID]
 * decides whether to render the page or throw up a splash screen
 */

import { Outlet, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Question, Survey, SurveyResponse } from "@prisma/client";
import FailureSplash from "~/components/FailureSplash";
export type FetchedSurveyData =
  | ({ Questions: ({ Responses: SurveyResponse[] } & Question)[] } & Survey)
  | null;

const SurveyIdPage = () => {
  /**
   * -surveyData starts out as "loading" then gets populated by the survey's information (if fetch is successful) or null if the lookup fails
   * -if surveyData is set to null, we failed to find a survey, and should display a failure screen
   * -otherwise, we can pass the fetched data down to the Outlet component
   */
  const [surveyData, setSurveyData] = useState<FetchedSurveyData | "pending">(
    "pending"
  );

  //get intended surveyId from url params
  const surveyId = useParams().surveyId;

  /**
   * -useEffect calls an async function to fetch survey data then set it into state
   * -in the mean time, we should render... nothing? we have a bit of a pending state
   * -will populate state with the infomration about the found survey or `null` if no survey is found
   */
  useEffect(() => {
    (async () => {
      const fetchedSurveyData = fetch(
        `http://localhost:4000/surveys/${surveyId}/full`
      )
        .then(data => data.json())
        .then((data: FetchedSurveyData) => setSurveyData(data));
    })();
  }, []);

  return (
    <>
      {surveyData === "pending" ? (
        "Loading..."
      ) : surveyData === null ? (
        <FailureSplash errorMessage="Survey id not found" />
      ) : (
        <Outlet context={surveyData} />
      )}
    </>
  );
};

export default SurveyIdPage;
