import { Question, Survey } from "@prisma/client";
import { useState } from "react";

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
      questionNumber: idx,
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

  return (
    <div className="flex flex-col gap-2">
      <div className="m-2 flex gap-2">
        <label htmlFor="Survey Name">Survey Name</label>
        <input
          className="inp"
          type="text"
          name="surveyName"
          value={surveyName}
          onChange={e => {
            setSurveyName(e.target.value);
          }}
        ></input>
      </div>

      <div>
        {questions.map((question, idx) => {
          return (
            <div className="m-2 flex gap-2" key={idx}>
              <label htmlFor={`Question ${idx}`}>{`Question ${idx + 1}`}</label>
              <input
                className="inp"
                type="text"
                name={`question${idx}`}
                value={question}
                onChange={e =>
                  updateQuestionByIndexFunction(idx, e.target.value)
                }
              />
            </div>
          );
        })}
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
