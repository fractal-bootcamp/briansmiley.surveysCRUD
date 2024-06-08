import { PrismaClient, Survey } from "@prisma/client";
import { Link } from "@remix-run/react";
const prisma = new PrismaClient();

import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

type SurveyFetchResponse = { surveys: Survey[] };

const fetchSurveys = async () => {
  const surveyData = await fetcher<SurveyFetchResponse>(() =>
    fetch("http://localhost:4000/surveys")
  );

  return surveyData.surveys;
};

const fetcher = async <T,>(
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
    <div className="flex flex-col ">
      {surveys.map(survey => (
        <div>
          <Link className="" to={`/surveys/${survey.id}`}>
            {survey.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
