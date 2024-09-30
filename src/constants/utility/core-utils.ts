import * as admin from 'firebase-admin';

export const convertTimestampToDate = (firestoreTimestamp: any) => {
	const date = admin.firestore.Timestamp.fromMillis(firestoreTimestamp._seconds * 1000 + Math.floor(firestoreTimestamp._nanoseconds / 1e6)).toDate();
	return date.toISOString()
}