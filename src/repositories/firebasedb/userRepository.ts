import { IUser, IUserRepository } from "../../interfaces/userInterface";
import { getFirestore } from "firebase-admin/firestore";
import bcrypt from "bcrypt";

export class FirebaseUserRepository implements IUserRepository {
  private db;

  constructor() {
    this.db = getFirestore();
  }

  async findAll(): Promise<IUser[]> {
    const snapshot = await this.db.collection("users").get();
    const users: IUser[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as IUser[];
    return users;
  }

  async findById(id: string): Promise<IUser | null> {
    const doc = await this.db.collection("users").doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const snapshot = await this.db.collection("users").where("email", "==", email).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IUser;
  }

  async create(user: Omit<IUser, "id">): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role,
    };
    const docRef = await this.db.collection("users").add(newUser);
    const savedUser = await docRef.get();
    return { id: savedUser.id, ...savedUser.data() } as IUser;
  }
}
