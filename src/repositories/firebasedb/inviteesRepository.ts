// import { Firestore } from "firebase-admin/firestore";
// import { IInvitee, IInviteeRepository, IInviteeWithoutId } from "../../interfaces/inviteesInterfaces";
// import { v4 as uuidv4 } from "uuid";

// export class FirebaseInviteesRepository implements IInviteeRepository {
//   private firestore: Firestore;
//   private collectionName = "invitees"; // Collection name

//   constructor(firestore: Firestore) {
//     this.firestore = firestore;
//   }

//   async findAll(): Promise<IInvitee[]> {
//     const snapshot = await this.firestore.collection(this.collectionName).get();
//     const invitees: IInvitee[] = [];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       invitees.push({
//         id: doc.id,
//         event_id: data.event_id,
//         user_id: data.user_id,
//         status: data.status,
//         qr_code: data.qr_code,
//         is_checked_in: data.is_checked_in,
//         checked_in_at: data.checked_in_at,
//         created_at: data.created_at,
//       });
//     });
//     return invitees;
//   }

//   async findById(id: string): Promise<IInvitee | null> {
//     const doc = await this.firestore.collection(this.collectionName).doc(id).get();
//     if (!doc.exists) {
//       return null;
//     }
//     const data = doc.data()!;
//     return {
//       id: doc.id,
//       event_id: data.event_id,
//       user_id: data.user_id,
//       status: data.status,
//       qr_code: data.qr_code,
//       is_checked_in: data.is_checked_in,
//       checked_in_at: data.checked_in_at,
//       created_at: data.created_at,
//     };
//   }

//   async findByEventId(event_id: string): Promise<IInvitee[]> {
//     const snapshot = await this.firestore
//       .collection(this.collectionName)
//       .where("event_id", "==", event_id)
//       .get();
      
//     const invitees: IInvitee[] = [];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       invitees.push({
//         id: doc.id,
//         event_id: data.event_id,
//         user_id: data.user_id,
//         status: data.status,
//         qr_code: data.qr_code,
//         is_checked_in: data.is_checked_in,
//         checked_in_at: data.checked_in_at,
//         created_at: data.created_at,
//       });
//     });
//     return invitees;
//   }

//   async findByUserId(user_id: string): Promise<IInvitee[]> {
//     const snapshot = await this.firestore
//       .collection(this.collectionName)
//       .where("user_id", "==", user_id)
//       .get();
      
//     const invitees: IInvitee[] = [];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       invitees.push({
//         id: doc.id,
//         event_id: data.event_id,
//         user_id: data.user_id,
//         status: data.status,
//         qr_code: data.qr_code,
//         is_checked_in: data.is_checked_in,
//         checked_in_at: data.checked_in_at,
//         created_at: data.created_at,
//       });
//     });
//     return invitees;
//   }

//   async create(invitee: IInviteeWithoutId): Promise<IInvitee> {
//     const id = uuidv4();
//     const created_at = new Date();
//     const status = invitee.status || "invited";
//     const qr_code = invitee.qr_code || `https://example.com/qr/${id}`;
//     const is_checked_in = invitee.is_checked_in ?? false;
//     const checked_in_at = invitee.checked_in_at ?? null;

//     const inviteeData = {
//       event_id: invitee.event_id,
//       user_id: invitee.user_id,
//       status,
//       qr_code,
//       is_checked_in,
//       checked_in_at,
//       created_at,
//     };

//     await this.firestore.collection(this.collectionName).doc(id).set(inviteeData);

//     return {
//       id,
//       ...inviteeData,
//     };
//   }

//   async updateStatus(id: string, status: string): Promise<IInvitee | null> {
//     const docRef = this.firestore.collection(this.collectionName).doc(id);

//     const doc = await docRef.get();
//     if (!doc.exists) {
//       return null;
//     }

//     await docRef.update({ status });

//     const updatedDoc = await docRef.get();
//     const data = updatedDoc.data()!;
//     return {
//       id: updatedDoc.id,
//       event_id: data.event_id,
//       user_id: data.user_id,
//       status: data.status,
//       qr_code: data.qr_code,
//       is_checked_in: data.is_checked_in,
//       checked_in_at: data.checked_in_at,
//       created_at: data.created_at,
//     };
//   }
// }
