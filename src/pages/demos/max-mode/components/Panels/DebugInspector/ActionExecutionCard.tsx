export function ActionExecutionCard({ resultType, resultData }: { resultType: string; resultData: any }) {
  return (
    <div
      className={`rounded-lg p-2 border ${
        resultType === "ACTION_EXECUTED"
          ? "bg-green-50 dark:bg-green-900/20 border-green-200"
          : resultType === "CONFIRMATION_REQUIRED"
            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200"
            : "bg-red-50 dark:bg-red-900/20 border-red-200"
      }`}
    >
      <h4 className="text-[10px] font-bold uppercase mb-1">Action</h4>
      <div className="grid grid-cols-3 gap-1 text-[9px]">
        <div>
          <span className="text-gray-500">Name:</span> <span className="font-medium">{resultData?.action || "—"}</span>
        </div>
        <div>
          <span className="text-gray-500">Confirm:</span>{" "}
          <span className="font-medium">{resultData?.confirmationRequired ? "Yes" : "No"}</span>
        </div>
        {resultData?.actionResult && (
          <div>
            <span className="text-gray-500">Result:</span>{" "}
            <span className={`font-medium ${resultData.actionResult.success ? "text-green-600" : "text-red-600"}`}>
              {resultData.actionResult.success ? "OK" : resultData.actionResult.errorCode}
            </span>
          </div>
        )}
      </div>
      {resultData?.confirmationMessage && <div className="mt-1 text-[9px] text-gray-600 italic truncate">{resultData.confirmationMessage}</div>}
    </div>
  );
}

