import express, { Express, Request, Response } from "express";
import { Question, Survey, SurveyResponse } from "@prisma/client";
import prisma from "~/client";
import cors from "cors";
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.post(
  "/create",
  async (
    req: express.Request<{}, {}, Omit<Survey, "id">>,
    res: express.Response
  ) => {
    if (!req.body.name) res.status(400).send();
    const newSurvey = await prisma.survey.create({
      data: req.body
    });

    res.json({ newSurvey });
  }
);
app.get("/surveys", async (req: Request, res: Response) => {
  const surveys = await prisma.survey.findMany();

  res.json({ surveys });
});
app.listen(port, () => {
  console.log(`Express running on post ${port}`);
});
