import React from "react";
import { db } from "../googleSignin/config";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";

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

export { getSolutions, getRecords };
