import { useEffect, useState } from "react";
import { getRecords } from "./serverdata";

const LeaderBoard = (props) => {
  const [recordTable, setRecordTable] = useState();

  const getScores = async () => {
    let data = await getRecords(props.imageIndex);
    data = data.records;
    data = data.sort((a, b) => a.score - b.score);
    data = data.map((highScore, index) => (
      <tr key={index}>
        <td>{highScore.name}</td>
        <td>{highScore.time}</td>
      </tr>
    ));
    setRecordTable(
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>{data}</tbody>
      </table>
    );
  };

  useEffect(() => {
    getScores();
    console.log("success");
  }, [props.imageIndex]);

  return <div>{recordTable}</div>;
};

export default LeaderBoard;
