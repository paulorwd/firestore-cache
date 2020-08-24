import { FirestoreHandler } from './FirestoreHandler';
import { CacheHandler } from './CacheHandler';
import { DbT, docCollection, docData, readManyType } from './types';

const { v1: uuidv1 } = require('uuid');
export class Database {
  fs: FirestoreHandler;
  cache: CacheHandler;
  constructor(public db: DbT) {
    this.fs = new FirestoreHandler({
      serviceAccKeyFilePath: db.serviceAccKeyFilePath
    });
    this.cache = new CacheHandler(db.cache_max_age, db.cache_allocated_memory);
  }

  async write<T>(writeObj: docCollection, document: docData) {
    const randomId = uuidv1();
    const preparedData = {
      collection: writeObj.collection.toLowerCase(),
      id: writeObj.id ? writeObj.id.toLowerCase() : null,
      uuid: randomId
    };

    const { id, collection, uuid } = preparedData;

    const getCollectionData = this.cache.get(collection);

    const documentIdData = getCollectionData ? getCollectionData[id] : null;

    const prepId = id ? id : uuid;
    const preparedCacheObjDoc = {
      [prepId]: document
    };

    this.cache.set(collection, preparedCacheObjDoc);
    let response;
    try {
      if (!documentIdData) {
        response = await this.fs.write(preparedData, document);
        // console.log('Write to firebase', response);
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  async readOne<T>(readObj: docCollection) {
    let response;
    try {
      const { id, collection } = readObj;

      const getCollectionFromCache = this.cache.get(collection[id]);

      if (getCollectionFromCache && getCollectionFromCache !== undefined) {
        response = getCollectionFromCache;
      } else {
        response = await this.fs.readOne(readObj);

        this.cache.set(collection[id], response);

        // console.log('From Firebase', response);
      }
    } catch (error) {
      throw error;
    }
    return response;
  }
  async readMany<T>(readManyObj: readManyType) {
    let response;
    try {
      if (
        this.cache.get(readManyObj.collection) &&
        this.cache.get(readManyObj.collection) !== undefined
      ) {
        // console.log('from cache', this.cache.get(readManyObj.collection));
        response = this.cache.get(readManyObj.collection);
      } else {
        response = await this.fs.readMany(readManyObj);
        this.cache.set(readManyObj.collection, response);
        // console.log('from service', response);
      }
    } catch (error) {
      throw error;
    }
    return response;
  }
}
