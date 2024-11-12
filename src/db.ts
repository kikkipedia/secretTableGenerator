import { set } from "firebase/database";
import { db } from "./firebase";
import { collection, addDoc, getDocs, getDoc, setDoc, doc } from "firebase/firestore";

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
            const newWords = [...docData.words, word];
            await setDoc(docRef, {words: newWords});

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
    console.log(tables);
    return tables;
}

//randomise table and count -1 on the table places
export const randomiseTable = async () => {
    //randomiser for 1-3
    const random = Math.floor(Math.random() * 3) + 1;
    const docRef = doc(db, `table/table${random}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const docData = docSnap.data();
        //update field places in table
        const newTable = docData.places - 1;
        await setDoc(docRef, {table: newTable});
    }
    return `table${random}`
}