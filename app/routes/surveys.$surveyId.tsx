import { fetcher } from "./surveys._index";
import { Survey, Question, SurveyResponse } from "@prisma/client";
import { useParams } from "@remix-run/react";
import { ChangeEventHandler, useEffect, useState } from "react";

type SingleSurveyFetchResponse = { survey: Survey };
type QuestionListFetchResponse = { questions: Question[] };
type SurveyWithQuestionsFetchResponse = {
  survey: Survey;
  questions: Question[];
};

export type SurveyResponseLocal = Omit<
  SurveyResponse,
  "id" | "createdAt" | "updatedAt"
>;

export type SurveyResponsePostBody = {
  answers: SurveyResponseLocal[];
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

//
const postResponsesToDatabase = async (
  newSurveyResponses: SurveyResponsePostBody
) => {
  const response = await fetch(`http://localhost:4000/answers/submit`, {
    method: "POST",
    body: JSON.stringify(newSurveyResponses),
    headers: new Headers({ "content-type": "application/json" })
  });

  if (response.ok) return await response.text();
  else return response.statusText;
};
const newEmptySurveyResponseLocal = (
  questionId: Question["id"]
): SurveyResponseLocal => ({
  questionId: questionId,
  responseContent: ""
});

export default function SurveyFilloutForm() {
  const [surveyName, setSurveyName] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<SurveyResponseLocal[]>([]);
  const resetAnswersState = () => {
    const newAnswers = Array.from(questions, question =>
      newEmptySurveyResponseLocal(question.id)
    );
    setAnswers(newAnswers);
  };
  const params = useParams();
  if (!params.surveyId) throw new Error("invalid surveyId");
  const surveyId = params.surveyId;

  //async useEffect to get the survey content into state
  useEffect(() => {
    const asyncGetSurveys = async () => {
      const { survey, questions } = await fetchSurvey(surveyId);
      setSurveyName(survey.name);
      setQuestions(questions);
      const newAnswers = Array.from(questions, question =>
        newEmptySurveyResponseLocal(question.id)
      );
      setAnswers(newAnswers);
    };
    asyncGetSurveys();
  }, []);

  const updateAnswerByQuestionIdFunction = (
    questionId: Question["id"],
    textarea: HTMLTextAreaElement
  ) => {
    const newAnswer = {
      questionId: questionId,
      responseContent: textarea.value
    };
    const maxTextareaHeight = 300;
    //Resize textarea to fit question (to a point)
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      maxTextareaHeight
    )}px`;
    //set questions to new content
    setAnswers(
      answers.map(answer =>
        answer.questionId === questionId ? newAnswer : answer
      )
    );
  };
  const submitSurveyAnswersButtonFunction = () => {
    postResponsesToDatabase({ answers });
    resetAnswersState();
  };
  return (
    <div className="flex flex-col m-2 gap-2">
      <h1>{surveyName}</h1>
      <div>
        {questions.map(question => {
          const questionAnswer = answers.find(
            answer => answer.questionId === question.id
          );
          if (!questionAnswer)
            throw new Error(
              `Failed a lookup of answer <===> question on question ${question.id}, answer array is currently ${answers.length} long`
            );
          return (
            <QuestionResponseRow
              question={question}
              answer={questionAnswer}
              onChangeFunction={e =>
                updateAnswerByQuestionIdFunction(question.id, e.target)
              }
              key={question.id}
            />
          );
        })}
      </div>
      <button className="btn" onClick={submitSurveyAnswersButtonFunction}>
        Submit Answers
      </button>
    </div>
  );
}
type QuestionResponseRowProps = {
  question: Question;
  answer: SurveyResponseLocal;
  onChangeFunction: ChangeEventHandler<HTMLTextAreaElement>;
};
const QuestionResponseRow = ({
  question,
  answer,
  onChangeFunction
}: QuestionResponseRowProps) => {
  const { questionNumber } = question;
  return (
    <div className="flex flex-col">
      <div>
        <label
          htmlFor={`answer${question.questionNumber}`}
          className="text-xl text-slate-500"
        >
          Question {questionNumber}: {question.content}
        </label>
      </div>
      <div>
        <textarea
          className="inp w-[400px] min-h-[60px]"
          id={`answer${questionNumber}`}
          value={answer.responseContent}
          onChange={onChangeFunction}
        />
      </div>
    </div>
  );
};
