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
export const randomiseTable = async (): Promise<string> => {
    //randomiser for 1-11 (number of tables)
    const random = Math.floor(Math.random() * 11) + 1;
    const docRef = doc(db, `table/table${random}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const docData = docSnap.data();
        //check if the places is zero
        if(docData.places === 0 || docData.places === undefined) {
            return randomiseTable();
        }
        else {
            //update field places in table
            const newTable = docData.places - 1;
            await setDoc(docRef, {table: newTable});
            return `table${random}`
        }
    }
    else {
        return randomiseTable();
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