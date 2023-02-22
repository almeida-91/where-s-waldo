import { useEffect, useState } from "react";
import { getRecords } from "./serverdata";
import "./leaderboard.css";

const LeaderBoard = (props) => {
  const [recordTable, setRecordTable] = useState();

  const getScores = async () => {
    let data = await getRecords(props.imageIndex);
    data = data.records;
    data = data.sort((a, b) => a.score - b.score);
    data = data.slice(0, 5).map((highScore, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{highScore.name}</td>
        <td>{highScore.time}</td>
      </tr>
    ));
    setRecordTable(
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>{data}</tbody>
      </table>
    );
  };

  useEffect(() => {
    getScores();
  }, [props.imageIndex]);

  return (
    <div className="leaderBoard">
      <h1>Leader Board</h1>
      <div className="leaderBoard">{recordTable}</div>
    </div>
  );
};

export default LeaderBoard;
