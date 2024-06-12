import express, { Request, Response } from "express";
import { Question, Survey, SurveyResponse } from "@prisma/client";
import { NewSurveyPostParams } from "~/routes/surveys.new";
import prisma from "~/client";
import cors from "cors";
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.post("/answers/submit", async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  const { answers } = body;
  const newlyCreatedAnswers = [];
  for (const newAnswer of answers) {
    const createdAnswer = await prisma.surveyResponse.create({
      data: newAnswer
    });
    newlyCreatedAnswers.push(createdAnswer);
  }
  console.log(newlyCreatedAnswers);
  res.json(newlyCreatedAnswers);
});

//create a new survey
app.post(
  "/create",
  async (req: Request<{}, {}, NewSurveyPostParams>, res: Response) => {
    //get and log reques body
    const body = req.body;
    console.log(body);

    //extract the to-be-added survey and questions array
    const { newSurvey, newSurveyQuestions } = body;

    //If there isnt a new survey name on the body we gots a problem
    if (!newSurvey) res.status(400).send();

    //Create the new survey
    const newlyCreatedSurvey = await prisma.survey.create({
      data: newSurvey
    });
    //Get the survey's id in database to assign new questions to it
    const newSurveyId = newlyCreatedSurvey.id;

    //Iterate through questions array and assign each one to
    const newlyCreatedQuestions = [];
    for (const newQuestion of newSurveyQuestions) {
      const createdQuestion = await prisma.question.create({
        data: Object.assign(newQuestion, { surveyId: newSurveyId })
      });
      //build the newly created question array for response
      newlyCreatedQuestions.push(createdQuestion);
    }

    res.json({ newlyCreatedSurvey, newlyCreatedQuestions });
  }
);
//removes a survey and its quetions and their answers from the database
app.delete("/surveys/:surveyId", async (req: Request, res: Response) => {
  const surveyId = req.params.surveyId;
  console.log(`Deleting survey ${surveyId}`);
  const deletedSurvey = await prisma.survey.delete({
    where: {
      id: surveyId
    }
  });
  const returnValue = JSON.stringify(deletedSurvey);
  console.log(`Deleted survey ${surveyId}, returning ${returnValue}`);
  res.json(deletedSurvey);
});

//get all questions tied to a survey
app.get("/surveys/:surveyId/questions", async (req: Request, res: Response) => {
  const questions = await prisma.question.findMany({
    where: {
      surveyId: {
        equals: req.params.surveyId
      }
    }
  });
  res.json({ questions });
});
//get one surveyId
app.get("/surveys/:surveyId", async (req: Request, res: Response) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: req.params.surveyId
    }
    // select: {
    //   name: true
    // }
  });
  if (survey === null) res.status(404).send("Survey not found");
  else res.json({ survey });
});
//get all surveys
app.get("/surveys", async (req: Request, res: Response) => {
  const surveys = await prisma.survey.findMany();

  res.json({ surveys });
});

/**
 * Fetch an entire survey and its questions and answers
 */
app.get("/surveys/:surveyId/full", async (req: Request, res: Response) => {
  const surveyId = req.params.surveyId;
  //find the survey with surveyId, and bundle all its questions and each question's answers
  const fetchedSurveyData = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: {
      Questions: {
        include: {
          Responses: true
        }
      }
    }
  });
  res.json(fetchedSurveyData);
});

//sends an array of a surveys answers and which questions they go with
app.get("/responses/:surveyId/", async (req: Request, res: Response) => {
  //extrac the survey we care about
  const surveyId = req.params.surveyId;

  // select the answers whose questions have a surveyId that matches the input parameter
  const answers = await prisma.surveyResponse.findMany({
    where: {
      question: { surveyId }
    },
    //include the questionId and answer content on the returned array
    select: {
      questionId: true,
      responseContent: true
    }
  });
  res.json(answers);
});
app.get("/", (req: Request, res: Response) => {
  res.send("Running express server here");
});

app.listen(port, () => {
  console.log(`Express running on post ${port}`);
});
