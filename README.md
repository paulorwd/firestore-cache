# Firestore-Cache

A Simple Wrapper npm-module to use Google Cloud Firestore DB with a Simple In-Memory Caching Mechanism enabled on requests and responses

# How to use?

```javascript
import { Database } from 'firestore-cache';

const db = new Database({
  serviceAccKeyFilePath: '../serviceAccountKey.json',
  cache_max_age: 4000,
  cache_allocated_memory: 100
});
```

### Read one entry from a collection

```javascript
const respond = await db.readOne({
  collection: collection,
  id: id
});

console.log(respond);
```

### Read Multiple entries from a collection

```javascript
const respond = await db.readMany({
  collection: collection
});

console.log(respond);
```

### Write an entry to a collection

Leave id '' to generate a dyamic ID, or provide an id of your choice

```javascript
const respond = await db.write({ id: '', collection }, documentData);

console.log(respond);
```
