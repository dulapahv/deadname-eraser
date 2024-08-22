import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const [showDeadname, setShowDeadname] = useState(false);
  const [deadname, setDeadname] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["deadname", "preferredName"], (result) => {
      setDeadname(result.deadname || "");
      setPreferredName(result.preferredName || "");
    });
  }, []);

  async function handleApply() {
    try {
      await chrome.storage.sync.set({
        deadname: deadname,
        preferredName: preferredName,
      });
      setMessage(t("Changes applied successfully!"));
      setIsError(false);
    } catch (error) {
      console.error(error);
      setMessage(t("Failed to apply changes!"));
      setIsError(true);
    }
  }

  return (
    <div className="m-4 h-[320px] w-[400px] space-y-2">
      <div className="flex">
        <h1 className="grow text-lg font-medium">Goodbye Deadname</h1>
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="rounded-md border border-slate-200 bg-slate-100 p-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <option value="en">English</option>
          <option value="th">ไทย</option>
        </select>
      </div>
      <div className="flex flex-col space-y-1">
        <p>{t("Enter the deadname")}</p>
        <button
          onClick={() => setShowDeadname(!showDeadname)}
          className="rounded-md border border-slate-200 bg-slate-100 p-1 px-2 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {showDeadname ? t("Hide deadname") : t("Show and edit deadname")}
        </button>
        <input
          onChange={(e) => setDeadname(e.target.value)}
          value={deadname}
          type={showDeadname ? "text" : "password"}
          disabled={!showDeadname}
          placeholder={`${t("Type here")}...`}
          className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <p>{t("Enter the preferred name")}</p>
        <input
          onChange={(e) => setPreferredName(e.target.value)}
          value={preferredName}
          type="text"
          placeholder={`${t("Type here")}...`}
          className="rounded-md border border-slate-200 bg-slate-100 p-1 px-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <p>{t("Click the button to apply the changes")}</p>
        <button
          onClick={handleApply}
          className="rounded-md border border-slate-200 bg-slate-100 p-1 px-2 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {t("Apply")}
        </button>
        {message && (
          <p className={isError ? "text-red-500" : "text-green-500"}>
            {t(message)}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
