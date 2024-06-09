import { PrismaClient, Survey } from "@prisma/client";
import { Link } from "@remix-run/react";
import { Trash2Icon } from "lucide-react";

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
  const asyncSetSurveys = async () => {
    // fetch the data
    const surveyData = await fetchSurveys();

    if (surveyData) {
      // update the data if it went well
      setSurveys(surveyData);
    }
  };

  useEffect(() => {
    asyncSetSurveys();
  }, []);

  const deleteSurvey = async (surveyId: Survey["id"]) => {
    const deletedSurvey = await fetcher<Survey>(() =>
      fetch(`http://localhost:4000/surveys/${surveyId}`, { method: "DELETE" })
    );
    if (!deletedSurvey)
      throw new Error("Deleting survey from database failed!");
    else {
      await asyncSetSurveys();
      return deletedSurvey;
    }
  };
  return (
    <div className="flex flex-col w-[200px]">
      {surveys.map((survey, idx) => {
        //alternate row backgrounds
        const background = idx % 2 ? "bg-[#FBFBFB]" : "bg-slate-200";
        return (
          <div
            className={`flex flex-row items-center ${background}`}
            key={survey.id}
          >
            <div className={`flex flex-col items-start px-2 py-1 w-[300px] `}>
              {/* Link to take the survey */}
              <Link className="lnk font-semibold" to={`/surveys/${survey.id}`}>
                {survey.name}
              </Link>
              {/*Link to view past responses*/}
              <Link
                className="lnk text-sm"
                to={`/surveys/${survey.id}/responses`}
              >
                Results
              </Link>
            </div>
            <div className="">
              <Trash2Icon
                className="cursor-pointer h-4"
                stroke="gray"
                onClick={() => deleteSurvey(survey.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
