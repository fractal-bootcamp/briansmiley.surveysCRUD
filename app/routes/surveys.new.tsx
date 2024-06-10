import { Question, Survey } from "@prisma/client";
import { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";

export type NewSurvey = Omit<Survey, "id">;
export type NewQuestion = Omit<Question, "id" | "surveyId">;
export type NewSurveyPostParams = {
  newSurvey: NewSurvey;
  newSurveyQuestions: NewQuestion[];
};

const addNewSurveyToDatabase = async (newSurvey: NewSurveyPostParams) => {
  const response = await fetch("http://localhost:4000/create", {
    method: "POST",
    body: JSON.stringify(newSurvey),
    headers: new Headers({ "content-type": "application/json" })
  });

  if (response.ok) return await response.text();
  else return response.statusText;
};

export default function NewSurveyForm() {
  const [surveyName, setSurveyName] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [nameRequiredWarning, setNameRequiredWarning] = useState(false);
  const surveyNameInput = useRef<HTMLInputElement>(null); //get a reference to the survey input so we can focus it

  //on-click to send the state variables off to db
  const clickSubmitFunction = () => {
    //if surveyName is blank, stop the submission, focus the input, and start showing the Name Required warning
    if (surveyName === "") {
      if (surveyNameInput.current) surveyNameInput.current.focus();
      setNameRequiredWarning(true);
      return;
    }

    //turn questions array into array of Question-table-ready-objects and the survey name into a Survey-Table-Ready object
    const preppedSurvey = { name: surveyName };
    const preppedQuestions: NewQuestion[] = questions.map((question, idx) => ({
      questionNumber: idx + 1,
      content: question
    }));

    //add the new survey to the database
    addNewSurveyToDatabase({
      newSurvey: preppedSurvey,
      newSurveyQuestions: preppedQuestions
    });

    //Reset state
    setSurveyName("");
    setQuestions([""]);
  };

  //controlled-input function that correlates a quesiton's input field with its element in the questions state array
  const updateQuestionByIndexFunction = (
    idx: number,
    textarea: HTMLTextAreaElement
  ) => {
    const newQuestion = textarea.value;
    const maxTextareaHeight = 300;
    //Resize textarea to fit question (to a point)
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      maxTextareaHeight
    )}px`;
    //set questions to new content
    setQuestions(
      questions.map((question, questionIndex) =>
        questionIndex === idx ? newQuestion : question
      )
    );
  };

  //Add a new, empty, question to state
  const addNewQuestion = () => setQuestions(questions.concat([""]));
  const deleteQuestionByIdFunction = (deleteAtIndex: number) => () => {
    const newQuestions = [...questions];
    newQuestions.splice(deleteAtIndex, 1);
    setQuestions(newQuestions);
  };
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className=" flex gap-2 items-center mb-2">
        <label htmlFor="surveyName" className="shrink-0">
          Survey Name:
        </label>
        <input
          className="inp"
          ref={surveyNameInput}
          type="text"
          id="surveyName"
          value={surveyName}
          onChange={e => setSurveyName(e.target.value)}
        ></input>
        <div className="text-red-500 h-fit">
          {surveyName == "" && nameRequiredWarning ? "Name required" : ""}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {questions.map((question, idx) => (
          <QuestionRow
            question={question}
            index={idx}
            onChangeFunction={e => updateQuestionByIndexFunction(idx, e.target)}
            deleteQuestionFunction={deleteQuestionByIdFunction(idx)}
            key={idx.toString()}
          />
        ))}
      </div>
      <button className="btn w-fit" onClick={addNewQuestion}>
        Add Question
      </button>
      <button className="btn w-20" onClick={clickSubmitFunction}>
        Submit
      </button>
    </div>
  );
}

type QuestionRowProps = {
  question: string;
  index: number;
  onChangeFunction: ChangeEventHandler<HTMLTextAreaElement>;
  deleteQuestionFunction: () => void;
};

const QuestionRow = ({
  question,
  index,
  onChangeFunction,
  deleteQuestionFunction
}: QuestionRowProps) => {
  return (
    <div className=" flex gap-2 items-start">
      <label
        htmlFor={`question${index}`}
        className="shrink-0 w-[6em]"
      >{`Question ${index + 1}:`}</label>
      <textarea
        className=" inp w-[400px] min-h-[60px]"
        id={`question${index}`}
        value={question}
        onChange={onChangeFunction}
      />
      {index ? (
        <div className="flex items-center h-full">
          <button
            className="btn bg-red-400 hover:bg-red-600 h-[25px] w-6"
            onClick={deleteQuestionFunction}
          >
            -
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
