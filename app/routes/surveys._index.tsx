import { PrismaClient, Survey } from "@prisma/client";
import { Link } from "@remix-run/react";
const prisma = new PrismaClient();

import { useEffect, useState } from "react";

type SurveyNamesListFetchResponse = { surveys: Survey[] };

const fetchSurveys = async () => {
  const surveyData = await fetcher<SurveyNamesListFetchResponse>(() =>
    fetch("http://localhost:4000/surveys")
  );

  return surveyData.surveys;
};

export const fetcher = async <T,>(
  fetchFn: () => Promise<Response>, //fetch call to run
  onError?: () => void //optional error handler
) => {
  const response = await fetchFn(); //await the fetch call
  if (!response.ok) {
    if (onError) {
      onError();
    }
    throw new Error(`Error when fetching!!!!`);
  }
  const responseJSON = await response.json(); //parse the json

  return responseJSON as T;
};

export default function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const asyncSetSurveys = async () => {
      // fetch the data
      const surveyData = await fetchSurveys();

      if (surveyData) {
        // update the data if it went well
        setSurveys(surveyData);
      }
    };

    asyncSetSurveys();
  }, []);

  return (
    <div className="flex flex-col  gap-2 m-2 ">
      {surveys.map(survey => (
        <Link className="lnk" to={`/surveys/${survey.id}`}>
          {survey.name}
        </Link>
      ))}
    </div>
  );
}
