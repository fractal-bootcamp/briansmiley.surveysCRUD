/**
 * Component to render instead of any given page if there is an error like an invalid Survey id
 */
export default function FailureSplash({
  errorMessage
}: {
  errorMessage: string;
}) {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-red-700 text-white rounded-3xl w-[60%] h-[30%] flex flex-col items-center justify-center gap-2">
        <h1 className="flex text-5xl text-center">Failure</h1>
        <div className="flex text-xl text-center">Error: {errorMessage}</div>
        <div className=" flex justify-center text-center"></div>
      </div>
    </div>
  );
}
