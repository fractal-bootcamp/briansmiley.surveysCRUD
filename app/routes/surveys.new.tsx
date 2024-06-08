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
  const clickSubmitFunction = (surveyName: string) => () => {
    addNewSurveyToDatabase({ name: surveyName });
    setSurveyName("");
  };

  return (
    <div className="">
      <div className="m-2 flex gap-2">
        <input
          className="inp"
          type="text"
          value={surveyName}
          onChange={e => {
            setSurveyName(e.target.value);
          }}
        ></input>
        <button className="btn" onClick={clickSubmitFunction(surveyName)}>
          Create
        </button>
      </div>
    </div>
  );
}
