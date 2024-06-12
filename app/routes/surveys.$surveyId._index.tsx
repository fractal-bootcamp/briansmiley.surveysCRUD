import { fetcher } from "./surveys._index";
import { Survey, Question, SurveyResponse } from "@prisma/client";
import { redirect, useOutletContext, useParams } from "@remix-run/react";
import { ChangeEventHandler, useEffect, useState } from "react";
import FailureSplash from "~/components/FailureSplash";
import SuccessSplash from "~/components/SuccessSplash";
import { FetchedSurveyData } from "./surveys.$surveyId";

export type SurveyResponseLocal = Omit<
  SurveyResponse,
  "id" | "createdAt" | "updatedAt"
>;

export type SurveyResponsePostBody = {
  answers: SurveyResponseLocal[];
};

//send submitted answers to the database
const postResponsesToDatabase = async (
  newSurveyResponses: SurveyResponsePostBody
): Promise<PostResponseOutput> => {
  const response = await fetch(`http://localhost:4000/answers/submit`, {
    method: "POST",
    body: JSON.stringify(newSurveyResponses),
    headers: new Headers({ "content-type": "application/json" })
  });
  const responseOutput = { json: await response.json(), ok: response.ok };
  return responseOutput;
};

//make a new populable SurveyResponse object associated to a passed in survey question, initialized with a blank answer
const newEmptySurveyResponseLocal = (
  questionId: Question["id"]
): SurveyResponseLocal => ({
  questionId: questionId,
  responseContent: ""
});

//the survey submission page, which can display either the survey form or splash for submission result
export default function SurveySubmissionPage() {
  const [submissionStatus, setSubmissionStatus] = useState({
    submitted: false,
    status: false,
    response: {}
  });

  // function passed in to the survey form component to set the submission status/result once submit is clicked
  const submissionStatusSetter = (postResponse: PostResponseOutput) => {
    setSubmissionStatus({
      submitted: true, //always sets submitted to true; it's called when submit is hit
      status: postResponse.ok, //whether the post came back with a success code
      response: postResponse.json //the content of the fetch response from posting the answers
    });
  };

  //if the form was submitted, we render Success/Failure depending on ok status
  return submissionStatus.submitted ? (
    submissionStatus.status ? (
      <SuccessSplash />
    ) : (
      <FailureSplash errorMessage={JSON.stringify(submissionStatus.response)} />
    )
  ) : (
    <SurveyFilloutForm submissionFunction={submissionStatusSetter} /> //otherwise render the survey form and pass in the submission status setter
  );
}

type SurveyFilloutFormProps = {
  submissionFunction: (res: PostResponseOutput) => void;
};

type PostResponseOutput = {
  json: {}; //the json body of the post response
  ok: boolean; //whether the post fetch returned ok
};
const SurveyFilloutForm = ({ submissionFunction }: SurveyFilloutFormProps) => {
  const [answers, setAnswers] = useState<SurveyResponseLocal[]>([]);

  /** Survey data should always be populated if we are loading this page; otherwise parent node would be pending/failed */
  const surveyData: FetchedSurveyData = useOutletContext()!;
  const questions = surveyData.Questions.map(({ Responses, ...rest }) => rest); //strip the responses out for data simplicity
  const surveyName = surveyData.name;

  /** Set the answers state array to an empty one of length questions.length */
  const resetAnswersState = () => {
    const newAnswers = Array.from(questions, question =>
      newEmptySurveyResponseLocal(question.id)
    );
    setAnswers(newAnswers);
  };
  useEffect(() => resetAnswersState(), []);
  //for passing as the onChange prop of an answers textarea to associate user input with answers state
  const updateAnswerByQuestionIdFunction = (
    questionId: Question["id"],
    textarea: HTMLTextAreaElement
  ) => {
    //create SurveyResponse object
    const newAnswer = {
      questionId: questionId,
      responseContent: textarea.value
    };

    //OnChange may as well simultaneously resize textarea to fit question (to a point)
    const maxTextareaHeight = 300;
    textarea.style.height = "auto"; //I think we need to set height to auto first in order for textarea.scrollHeight to work in the next line
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      maxTextareaHeight
    )}px`;

    //set state answers array to include the change
    setAnswers(
      answers.map(answer =>
        answer.questionId === questionId ? newAnswer : answer
      )
    );
  };

  //callback for the Submit survey button
  const submitSurveyAnswersButtonFunction = async () => {
    const postResponse = await postResponsesToDatabase({ answers }); //send the answers array to database
    resetAnswersState(); //reset the answers array to empty answers (this is pointless since we redirect but feels clea and might be useful for future behaviour)
    submissionFunction(postResponse); //perform the main component's passed in state function to pass our post action/results back up
  };

  return (
    <div className="flex flex-col m-2 gap-2">
      <h1>{surveyName}</h1>
      <div>
        {questions.map(question => {
          /**  */
          const questionAnswer =
            answers.find(answer => answer.questionId === question.id) ||
            newEmptySurveyResponseLocal(question.id);
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
};

//component for displaying quesitons and their answer boxes
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
