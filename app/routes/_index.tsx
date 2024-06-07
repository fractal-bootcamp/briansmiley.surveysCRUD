import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "Survey App" },
    { name: "description", content: "Welcome to Remix!" }
  ];
};

export default function Index() {
  return (
    <div className="text-5xl text-teal-500 underline">
      <Link to="/surveys">Surveys</Link>
    </div>
  );
}
