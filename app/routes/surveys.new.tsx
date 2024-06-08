import { Question, Survey } from "@prisma/client";
import { ChangeEvent, ChangeEventHandler, useState } from "react";

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

  //on-click to send the state variables off to db
  const clickSubmitFunction = () => () => {
    //turn questions array into array of Question-table-ready-objects and the survey name into a Survey-Table-Ready object
    const preppedSurvey = { name: surveyName };
    const preppedQuestions: NewQuestion[] = questions.map((question, idx) => ({
      questionNumber: idx + 1,
      content: question
    }));

    addNewSurveyToDatabase({
      newSurvey: preppedSurvey,
      newSurveyQuestions: preppedQuestions
    });

    //Reset state
    setSurveyName("");
    setQuestions([""]);
  };

  //controlled-input function that correlates a quesiton's input field with its element in the questions state array
  const updateQuestionByIndexFunction = (idx: number, newQuestion: string) =>
    setQuestions(
      questions.map((question, questionIndex) =>
        questionIndex === idx ? newQuestion : question
      )
    );

  //Add a new, empty, question to state
  const addNewQuestion = () => setQuestions(questions.concat([""]));
  const deleteQuestionByIdFunction = (deleteAtIndex: number) => () => {
    const newQuestions = [...questions];
    newQuestions.splice(deleteAtIndex, 1);
    setQuestions(newQuestions);
  };
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className=" flex gap-2">
        <label htmlFor="surveyName" className="shrink-0">
          Survey Name
        </label>
        <input
          className="inp"
          type="text"
          id="surveyName"
          value={surveyName}
          onChange={e => {
            setSurveyName(e.target.value);
          }}
        ></input>
      </div>

      <div className="flex flex-col gap-2">
        {questions.map((question, idx) => (
          <QuestionRow
            question={question}
            index={idx}
            onChangeFunction={e =>
              updateQuestionByIndexFunction(idx, e.target.value)
            }
            deleteQuestionFunction={deleteQuestionByIdFunction(idx)}
            key={idx.toString()}
          />
        ))}
      </div>
      <button className="btn w-fit" onClick={addNewQuestion}>
        Add Question
      </button>
      <button className="btn w-20" onClick={clickSubmitFunction()}>
        Submit
      </button>
    </div>
  );
}

type QuestionRowProps = {
  question: string;
  index: number;
  onChangeFunction: ChangeEventHandler<HTMLInputElement>;
  deleteQuestionFunction: () => void;
};

const QuestionRow = ({
  question,
  index,
  onChangeFunction,
  deleteQuestionFunction
}: QuestionRowProps) => {
  return (
    <div className=" flex gap-2 items-center">
      <label
        htmlFor={`question${index}`}
        className="shrink-0 w-[6em]"
      >{`Question ${index + 1}:`}</label>
      <input
        className="inp"
        type="text"
        id={`question${index}`}
        value={question}
        onChange={onChangeFunction}
      />
      <button
        className="btn bg-red-400 hover:bg-red-600 h-[75%] w-6"
        onClick={deleteQuestionFunction}
      >
        -
      </button>
    </div>
  );
};
