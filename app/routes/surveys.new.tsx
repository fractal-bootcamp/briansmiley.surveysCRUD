import { PrismaClient, Question, Survey } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
const prisma = new PrismaClient();

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

type WithoutId<T> = Omit<T, "id">;
type NewSurveyParams = WithoutId<Survey>;
type NewQuestionParams = WithoutId<Question>;

const addNewSurveyToDatabase = async (survey: NewSurveyParams) => {
  const response = await fetch("http://localhost:4000/create", {
    method: "POST",
    body: JSON.stringify(survey),
    headers: new Headers({ "content-type": "application/json" })
  });

  if (response.ok) return await response.text();
  else return response.statusText;
};

export default function NewSurveyForm() {
  const [surveyName, setSurveyName] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const clickSubmitFunction = (surveyName: string) => () => {
    addNewSurveyToDatabase({ name: surveyName });
    setSurveyName("");
  };
  const updateQuestionByIndexFunction = (idx: number, newQuestion: string) =>
    setQuestions(
      questions.map((question, questionIndex) =>
        questionIndex === idx ? newQuestion : question
      )
    );
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
              ></input>
            </div>
          );
        })}
      </div>
      <button className="btn w-20" onClick={addNewQuestion}>
        Add Question
      </button>
      <button className="btn w-20" onClick={clickSubmitFunction(surveyName)}>
        Create
      </button>
    </div>
  );
}
