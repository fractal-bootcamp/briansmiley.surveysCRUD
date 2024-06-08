import { fetcher } from "./surveys._index";
import { Survey, Question } from "@prisma/client";
import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";

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

export default function SurveyFilloutForm() {
  const [surveyName, setSurveyName] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const params = useParams();
  if (!params.surveyId) throw new Error("invalid surveyId");
  const surveyId = params.surveyId;

  //
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
