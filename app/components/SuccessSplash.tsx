import { Link } from "@remix-run/react";

export default function SuccessSplash() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-teal-700 text-white rounded-3xl w-[60%] h-[30%] flex flex-col items-center justify-center gap-2">
        <h1 className="flex text-5xl text-center">Success</h1>
        <div className="flex text-xl text-center">
          Survey answers successfully submitted!
        </div>
        <div className=" flex justify-center text-center">
          <Link to="/surveys">Take another survey?</Link>
        </div>
      </div>
    </div>
  );
}
