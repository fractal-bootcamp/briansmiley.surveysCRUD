import { PrismaClient } from "@prisma/client";
import { Link } from "@remix-run/react";
const prisma = new PrismaClient();

import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const surveys = await prisma.survey.findMany();
  return surveys;
};
export default function SurveyList() {
  const surveys = useLoaderData<typeof loader>();
  return (
    <div>
      <div>
        {surveys.map(survey => (
          <Link to={`/surveys/${survey.id}`}>{survey.name}</Link>
        ))}
      </div>
      ;
    </div>
  );
}
