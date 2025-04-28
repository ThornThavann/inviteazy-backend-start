// import { Router, Request, Response } from 'express';
// import { db } from '../config/firebasedb/db';
// import { v4 as uuidv4 } from 'uuid';

// export default function eventFireRoutes(): Router {
//     const app = Router();

//     app.get('/', async (req: Request, res: Response): Promise<void> => {
//         try {
//             console.log('Fetching all event from Firestore');
//             const eventRef = db.collection('events');
//             const snapshot = await eventRef.get();

//             // Transform Firestore documents into an array
//             const events = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));

//             res.status(200).json({
//                 message: 'Fetched all event successfully',
//                 data: events,
//             });
//         } catch (error: any) {
//             console.error('Error fetching event:', error);
//             res.status(500).json({ message: 'Failed to fetch event', error: error.message });
//         }
//     });

//     return app;
// }