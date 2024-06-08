import express, { Express, Request, Response } from "express";
import { Question, Survey, SurveyResponse } from "@prisma/client";
import { NewSurveyPostParams } from "~/routes/surveys.new";
import prisma from "~/client";
import cors from "cors";
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

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
app.get("/surveys", async (req: Request, res: Response) => {
  const surveys = await prisma.survey.findMany();

  res.json({ surveys });
});
app.listen(port, () => {
  console.log(`Express running on post ${port}`);
});
