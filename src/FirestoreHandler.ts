import { initializeApp, credential, app } from 'firebase-admin';
import { DbT, docCollection, docData, readManyType, fbObj } from './types';

export class FirestoreHandler {
  private fireStoreNS: FirebaseFirestore.Firestore;
  serviceAccountKey: any;
  document: any;
  fireApp: app.App;
  constructor(public db: fbObj) {
    this.init(db);
  }

  async init(db: fbObj) {
    const serviceAccountKey = typeof db.serviceAccKeyFilePath === 'string' 
      ? await import(db.serviceAccKeyFilePath)
      : db.serviceAccKeyFilePath;
  
    this.fireApp = initializeApp({
      credential: credential.cert(serviceAccountKey as any)
    });
    this.fireStoreNS = this.fireApp.firestore();
  }

  async write<T>(writeObj: docCollection, document: docData) {
    let response;
    if (writeObj.id) {
      const dataAvailability = await this.readOne(writeObj);
      if (dataAvailability !== undefined) {
        //Matching records so let's update the existing document
        response = await this.fireStoreNS
          .collection(writeObj.collection)
          .doc(writeObj.id)
          .update(document);
      } else {
        //No matching records, so let's create a new one
        response = await this.fireStoreNS
          .collection(writeObj.collection)
          .doc(writeObj.id)
          .set(document);
      }
    } else {
      //No id is provided, so let's create one with a UUID
      response = await this.fireStoreNS
        .collection(writeObj.collection)
        .doc(writeObj.uuid)
        .set(document);
    }

    return response;
  }

  async readOne<T>(readObj: docCollection) {
    const { collection, id } = readObj;

    const referenceDoc = await this.fireStoreNS
      .collection(collection)
      .doc(id)
      .get();

    return referenceDoc.data();
  }

  async readMany<T>(readManyObj: readManyType) {
    const { collection, filter } = readManyObj;
    const collectionPath = collection;

    let docData = [];
    let referenceDoc = filter
      ? await this.fireStoreNS
          .collection(collectionPath)
          .where(filter.fieldName, '==', filter.fieldValue)
          .get()
      : await this.fireStoreNS.collection(collectionPath).get();
    if (referenceDoc.empty) {
      // console.log('No Matching Docs');
      return;
    }

    referenceDoc.forEach((doc) => {
      docData.push(doc.data());
    });

    return docData;
  }
}
