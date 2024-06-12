import { useEffect, useState } from "react";
import { SurveyResponse, Question } from "@prisma/client";
import { useOutletContext, useParams } from "@remix-run/react";
import { FetchedSurveyData } from "./surveys.$surveyId";
type AnswersArray = Pick<SurveyResponse, "questionId" | "responseContent">[];
type SurveyData = Exclude<FetchedSurveyData, null>;
const SurveyResultsTable = () => {
  /**
   * -We access the fetched survey data pulled on the template page
   * -It can't be null because we would have rendered a failure splash instead
   * -Contains all questions and responses on the argument survey
   */
  const surveyData: SurveyData = useOutletContext();
  return (
    <div>
      Test
      {surveyData.Questions.map(question => (
        <QuestionResponseBlock question={question} key={question.id} />
      ))}
    </div>
  );
};

const QuestionResponseBlock = ({
  question
}: {
  question: SurveyData["Questions"][number];
}) => {
  //Render a question with all its answers
  //Justrendering the questions for now
  return <div>{question.content}</div>;
};

export default SurveyResultsTable;
