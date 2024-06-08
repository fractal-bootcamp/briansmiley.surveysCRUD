import { Link } from "@remix-run/react";

export default function Sidebar() {
  return (
    <div className=" text-xl text-white flex flex-col bg-teal-700 h-full w-fit px-4 gap-1 py-6">
      <Link className="hover:bg-teal-800 p-2 rounded-lg" to="/surveys">
        Surveys
      </Link>
      <Link className="hover:bg-teal-800 p-2 rounded-lg" to="/surveys/new">
        New Survey
      </Link>
    </div>
  );
}
