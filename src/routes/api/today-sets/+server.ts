import { firestore } from '$lib/firebase';
import { json, type RequestHandler } from '@sveltejs/kit';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export const GET: RequestHandler = async ({ url }) => {
  const team = url.searchParams.get('team');

  if (!team) {
    return {
      status: 400,
      body: 'Missing team parameter'
    };
  }

  const teamDoc = await getDoc(doc(firestore, 'teams', team));

  if (!teamDoc.exists()) {
    return {
      status: 404,
      body: 'Team not found'
    };
  }

  const sets = teamDoc.get('sets') as string[];

  if (!sets || sets.length === 0) {
    return json([]);
  }

  const setDocs = await Promise.all(
    sets.map(async (set) => await getDoc(doc(firestore, 'sets', set)))
  );

  const sameDate = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  return json(
    setDocs
      .map((setDoc) => setDoc.data())
      .filter((set) => set && sameDate(set.timestamp.toDate(), new Date()))
  );
};
