import { fetcher } from "./surveys._index";
import { Survey, Question } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return params.surveyId;
};
type SingleSurveyFetchResponse = { survey: Survey };
type QuestionListFetchResponse = { questions: Question[] };
type SurveyWithQuestionsFetchResponse = {
  survey: Survey;
  questions: Question[];
};

const fetchSurvey = async (
  surveyId: string
): Promise<SurveyWithQuestionsFetchResponse> => {
  const surveyFetchResponse = await fetcher<SingleSurveyFetchResponse>(() =>
    fetch(`http://localhost:4000/surveys/${surveyId}`)
  );
  const survey = surveyFetchResponse.survey;
  const questionsFetchResponse = await fetcher<QuestionListFetchResponse>(() =>
    fetch(`http://localhost:4000/surveys/${surveyId}/questions`)
  );
  const questions = questionsFetchResponse.questions;
  return { survey, questions };
};

export default function SurveyList() {
  const [surveyName, setSurveyName] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const surveyId = useLoaderData<typeof loader>();
  useEffect(() => {
    const asyncGetSurveys = async () => {
      const { survey, questions } = await fetchSurvey(surveyId);
      setSurveyName(survey.name);
      setQuestions(questions);
    };
    asyncGetSurveys();
  }, []);
  if (surveyId === null) throw new Error("Invalid surveyId");
  return (
    <div>
      <div>{surveyName}</div>
      {questions.map(question => {
        return (
          <div className="flex">
            Question {question.questionNumber}: {question.content}
          </div>
        );
      })}
    </div>
  );
}
