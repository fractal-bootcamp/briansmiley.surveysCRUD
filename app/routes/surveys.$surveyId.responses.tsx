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
      <div className="text-2xl">{surveyData.name}</div>
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
  return (
    <div>
      <h2 className="font-semibold text-gray-600 text-lg">
        {question.content}
      </h2>
      <div className="flex">
        {/**spacer div on the left of the answers for each block */}
        <div className="w-[20px]"></div>
        <ul>
          {question.Responses.map(response => (
            <ResponseBlock
              content={response.responseContent}
              key={response.id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

//COntains one question response
//prettier-ignore
const ResponseBlock = ({content}: {
  content: SurveyResponse["responseContent"];
}) => {
  return <li>•{content}</li>;
};

export default SurveyResultsTable;
