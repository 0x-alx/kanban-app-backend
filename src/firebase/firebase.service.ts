import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from '../../firebase-adminsdk.json';

@Injectable()
export class FirebaseService {
  private db: Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }
    this.db = getFirestore();
  }

  getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }

  async addDocument(collectionName: string, data: any) {
    const docRef = await this.db.collection(collectionName).add(data);
    return { id: docRef.id, ...data };
  }

  async getDocuments(collectionName: string) {
    const snapshot = await this.db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getDocument<T>(collectionName: string, id: string): Promise<T> {
    const doc = await this.db.collection(collectionName).doc(id).get();
    if (!doc.exists) {
      throw new Error(`Document not found in ${collectionName} with id ${id}`);
    }
    return { id: doc.id, ...doc.data() } as T;
  }

  async deleteDocument(collectionName: string, id: string) {
    console.log({ collectionName, id });
    await this.db.collection(collectionName).doc(id).delete();
  }

  async getDocumentsWhere<T>(
    collectionName: string,
    field: string,
    operator: FirebaseFirestore.WhereFilterOp,
    value: any
  ): Promise<T[]> {
    const snapshot = await this.db
      .collection(collectionName)
      .where(field, operator, value)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  }

  async updateDocument<T>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ): Promise<void> {
    await this.db.collection(collectionName).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }
}
