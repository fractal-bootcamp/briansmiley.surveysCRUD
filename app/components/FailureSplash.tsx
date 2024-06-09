import { Link } from "@remix-run/react";

export default function FailureSplash({ responseJson }: { responseJson: {} }) {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-red-700 text-white rounded-3xl w-[60%] h-[30%] flex flex-col items-center justify-center gap-2">
        <h1 className="flex text-5xl text-center">Failure</h1>
        <div className="flex text-xl text-center">
          Your survey submission didn't work properly
        </div>
        <div className=" flex justify-center text-center">
          Response: {JSON.stringify(responseJson)}
        </div>
      </div>
    </div>
  );
}
