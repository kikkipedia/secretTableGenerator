import { db } from "./firebase";
import { collection,  getDocs, getDoc, setDoc, doc, runTransaction, increment } from "firebase/firestore";

//Collection name = words
//Document name = artwork1-5
//Field name = words as array of strings

export const saveWords = async (words: string[]) => {
    
    //for each word in words, add to the document artwork1-5
    words.forEach(async (word, index) => {
        const docRef = doc(db, `words/artwork${index + 1}`);
        //add to word array
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const docData = docSnap.data();
            if(!docData.words) {
                await setDoc(docRef, {words: [word]});
            } else {
                const newWords = [...docData.words, word];
                await setDoc(docRef, {words: newWords});
            }

        } else {
            await setDoc(docRef, {words: [word]});
        }
        return docRef;
    });
}

export const getWords = async (id: string) => {
    const docRef = doc(db, `words/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

export const getAllTables = async () => {
    const querySnapshot = await getDocs(collection(db, "table"));
    const tables = querySnapshot.docs.map(doc => doc.data());
    console.log(tables); //should be 11 tables
    return tables;
}

//randomise table and count -1 on the table places
export const randomiseSign = async (): Promise<string> => {
    console.log("Randomising sign...");
    const signs = ['circle', 'square', 'triangle'];
    const random = signs[Math.floor(Math.random() * signs.length)];
    const docRef = doc(db, `signs/${random}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const docData = docSnap.data();
        //check if the places is zero - then randomise again
        if(docData.total === 0 || docData.total === undefined) {
            return randomiseSign();
        }
        else {
            //update field total in signs collection -1
            const newSign = docData.total - 1;
            await setDoc(docRef, {total: newSign});
            console.log(`Sign: ${random}, Places left: ${newSign}`);
            return `sign${random}`
        }
    }
    else {
        return randomiseSign();
    }
    
    
}

export const getSymbolNumber = async (): Promise<number> => {
  const ref = doc(db, 'symbols/symbolCounter');

  const mod = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current =
      snap.exists() && typeof snap.data().number === 'number'
        ? snap.data().number
        : 0;

    // Atomic increment; creates the field if missing
    tx.set(ref, { number: increment(1) }, { merge: true });

    const next = current + 1;       
    return next % 3;                
  });

  return mod;
};