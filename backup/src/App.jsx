// App.js
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [count, setCount] = useState("");
  const [date, setDate] = useState("");
  const [score, setScore] = useState(0);
  const [lastDate, setLastDate] = useState(null);
  const [entries, setEntries] = useState({});
  const [streak, setStreak] = useState(0);
  const [daysSinceUpdate, setDaysSinceUpdate] = useState(0);

  useEffect(() => {
    const savedScore = parseInt(localStorage.getItem("score")) || 0;
    const savedLastDate = localStorage.getItem("lastDate");
    const savedEntries = JSON.parse(localStorage.getItem("entries")) || {};
    const savedStreak = parseInt(localStorage.getItem("streak")) || 0;

    setScore(savedScore);
    setLastDate(savedLastDate);
    setEntries(savedEntries);
    setStreak(savedStreak);

    if (savedLastDate) {
      const diff = getDateDiff(savedLastDate, getToday());
      setDaysSinceUpdate(diff);
    }
  }, []);

  const getToday = () => new Date().toISOString().slice(0, 10);

  const getDateDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleSubmit = () => {
    if (!count || isNaN(count) || !date) return;

    let penalty = 0;
    const today = getToday();

    if (lastDate && lastDate !== date) {
      const missedDays = getDateDiff(lastDate, date);

      for (let i = 1; i < missedDays; i++) {
        penalty += i * 4;
      }

      setStreak(0); // Reset streak if missed
      localStorage.setItem("streak", "0");
    } else {
      setStreak(prev => prev + 1);
      localStorage.setItem("streak", streak + 1);
    }

    const updatedScore = score - penalty + parseInt(count);
    const newEntries = { ...entries, [date]: parseInt(count) };

    setScore(updatedScore);
    setLastDate(date);
    setEntries(newEntries);
    setDaysSinceUpdate(0);
    localStorage.setItem("score", updatedScore);
    localStorage.setItem("lastDate", date);
    localStorage.setItem("entries", JSON.stringify(newEntries));
    setCount("");
    setDate("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-blue-400 p-4">
      <div className="text-black text-sm font-semibold self-end pr-2">
        Streak {streak}
      </div>

      <div className="flex flex-col items-center justify-center mt-10">
        <div className="w-48 h-48 rounded-full bg-white flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Score</h1>
          <p className="text-4xl font-bold">{score}</p>
          <span className="text-xs mt-2">Last Update +{daysSinceUpdate}</span>
        </div>
      </div>

      <div className="w-full bg-black rounded-t-full pt-10 px-6 pb-10 mt-16">
        <div className="flex flex-col gap-4 text-white">
          <label>
            Enter Count
            <input
              type="number"
              className="w-full mt-1 p-2 rounded text-black"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              className="w-full mt-1 p-2 rounded text-black"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={getToday()}
            />
          </label>
          <button
            className="bg-lime-400 text-black font-semibold py-2 rounded mt-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
