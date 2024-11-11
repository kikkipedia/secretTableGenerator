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
