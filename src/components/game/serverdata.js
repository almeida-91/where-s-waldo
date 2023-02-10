import { db } from "../googleSignin/config";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
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

async function saveNewHighScore(imageIndex, newScore) {
  console.log("new score: " + newScore);
  const docRef = doc(db, "records", "image" + imageIndex);

  const docSnap = await getDoc(docRef);
  let scoreArray = docSnap.data().records;
  console.log(scoreArray);
  scoreArray.push(newScore);
  scoreArray.sort((a, b) => a.score - b.score);
  scoreArray.pop();
  scoreArray = Object.assign({}, scoreArray);

  await setDoc(docRef, scoreArray);
}

export { getSolutions, getRecords, saveNewHighScore };
