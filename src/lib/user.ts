import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { eventToKey, type Event } from './swimming';

export const addTime = async (user: string, event: Event, time: number, _timestamp?: Date) => {
  const userDoc = await getDoc(doc(firestore, `users/${user}`));
  const userData = userDoc.data();

  if (!userDoc || !userData) throw new Error('User not found');

  const timestamp = _timestamp ?? new Date();

  const pbs = userData.pbs;
  const pb = pbs?.[eventToKey(event)];

  if (!pb || time < pb) {
    await updateDoc(doc(firestore, `users/${user}`), {
      pbs: {
        ...pbs,
        [eventToKey(event)]: time
      }
    });
  }

  await addDoc(collection(firestore, `users/${user}/history`), {
    event: eventToKey(event),
    time,
    timestamp: timestamp
  });

  await setDoc(
    doc(firestore, `users/${user}/monthly/${timestamp.getFullYear()}-${timestamp.getMonth() + 1}`),
    {
      [eventToKey(event)]: arrayUnion(time),
      times: arrayUnion(time)
    },
    { merge: true }
  );
};

if (typeof window !== 'undefined') window.addTime = addTime;
