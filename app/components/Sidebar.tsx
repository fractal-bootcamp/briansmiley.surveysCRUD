import { Link } from "@remix-run/react";
import { useState } from "react";
type PageLinkProps = {
  setCurrent: () => void;
  url: string;
  label: string;
  isCurrent: boolean;
};

const pages: Omit<PageLinkProps, "setCurrent" | "isCurrent">[] = [
  {
    url: "/surveys",
    label: "Surveys"
  },
  {
    url: "surveys/new",
    label: "New Survey"
  }
];
const PageLink = ({ setCurrent, url, label, isCurrent }: PageLinkProps) => {
  const selectionDependentClass = isCurrent
    ? "bg-teal-500 hover:bg-teal-600"
    : "hover:bg-teal-800";
  return (
    <Link
      className={`${selectionDependentClass} p-4 `}
      to={url}
      onClick={setCurrent}
    >
      {label}
    </Link>
  );
};
export default function Sidebar() {
  const [currentPage, setCurrentPage] = useState("/");

  return (
    <div className=" text-xl text-white flex flex-col bg-teal-700 h-full w-fit  gap-1s">
      {pages.map(pageInfo => (
        <PageLink
          {...pageInfo}
          setCurrent={() => setCurrentPage(pageInfo.url)}
          isCurrent={currentPage === pageInfo.url}
          key={pageInfo.url}
        />
      ))}
    </div>
  );
}
