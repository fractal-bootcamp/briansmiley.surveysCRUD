import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // const survey = await prisma.survey.findUnique({
  //   where: {
  //     id: params.surveyId
  //   }
  // });
  return params.surveyId;
};

export default function Survey() {
  const survey = useLoaderData<typeof loader>();
  if (survey === null) throw new Error("Invalid surveyId");
  return (
    <div>
      <div>test {survey}</div>;
    </div>
  );
}
