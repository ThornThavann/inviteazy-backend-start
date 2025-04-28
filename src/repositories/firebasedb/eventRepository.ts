// import { Firestore } from "firebase-admin/firestore";
// import {
//   IEvent,
//   IEventRepository,
//   IEventWithoutId,
// } from "../../interfaces/eventInterface";

// export class FirebaseEventRepository implements IEventRepository {
//   private firestore: Firestore;
//   private collectionName = "events"; // Collection name

//   constructor(firestore: Firestore) {
//     this.firestore = firestore;
//   }

//   async findAll(): Promise<IEvent[]> {
//     const snapshot = await this.firestore.collection(this.collectionName).get();
//     const events: IEvent[] = [];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       events.push({
//         id: doc.id,
//         name: data.name,
//         date: data.date,
//         time: data.time,
//         location: data.location,
//         description: data.description,
//       });
//     });
//     return events;
//   }

//   async create(event: IEventWithoutId): Promise<IEvent> {
//     const docRef = await this.firestore.collection(this.collectionName).add(event);
//     const doc = await docRef.get();
//     const data = doc.data()!;
//     return {
//       id: doc.id,
//       name: data.name,
//       date: data.date,
//       time: data.time,
//       location: data.location,
//       description: data.description,
//     };
//   }

//   async findById(id: string): Promise<IEvent | null> {
//     const doc = await this.firestore.collection(this.collectionName).doc(id).get();
//     if (!doc.exists) {
//       return null;
//     }
//     const data = doc.data()!;
//     return {
//       id: doc.id,
//       name: data.name,
//       date: data.date,
//       time: data.time,
//       location: data.location,
//       description: data.description,
//     };
//   }

//   async findByName(name: string): Promise<IEvent | null> {
//     const snapshot = await this.firestore
//       .collection(this.collectionName)
//       .where("name", "==", name)
//       .limit(1)
//       .get();

//     if (snapshot.empty) {
//       return null;
//     }

//     const doc = snapshot.docs[0];
//     const data = doc.data();
//     return {
//       id: doc.id,
//       name: data.name,
//       date: data.date,
//       time: data.time,
//       location: data.location,
//       description: data.description,
//     };
//   }
// }
