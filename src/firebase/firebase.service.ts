import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore, getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService {
  private db: Firestore;
 
  constructor() {
    console.log(process.env.FIREBASE_TYPE);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          type: process.env.FIREBASE_TYPE,
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          clientId: process.env.FIREBASE_CLIENT_ID,
          authUri: process.env.FIREBASE_AUTH_URI,
          tokenUri: process.env.FIREBASE_TOKEN_URI,
          authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
          clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        } as admin.ServiceAccount),
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
