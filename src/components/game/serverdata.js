import { db } from "../googleSignin/config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

async function getSolutions(imageIndex) {
  const docRef = doc(db, "solutions", "image" + imageIndex);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  return docSnap.data();
}

async function getRecords(imageIndex) {
  const docRef = doc(db, "records", "image" + imageIndex);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }

  return docSnap.data();
}

// Saves the new high score and removes the lowest one from firebase
async function saveNewHighScore(imageIndex, newScore) {
  const docRef = doc(db, "records", "image" + imageIndex);

  const docSnap = await getDoc(docRef);
  let scoreArray = docSnap.data().records;

  scoreArray.push(newScore);
  scoreArray.sort((a, b) => a.score - b.score);
  const lowestScore = scoreArray.pop();
  scoreArray = scoreArray.map((element) => Object.assign({}, element));

  // Remove lowest score if there are more than 5 highscores
  if (scoreArray.length > 5) {
    await updateDoc(docRef, {
      records: arrayRemove(lowestScore),
    });
  }

  await updateDoc(docRef, { records: arrayUnion(newScore) });
}

export { getSolutions, getRecords, saveNewHighScore };
