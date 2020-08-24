# Firestore-Cache

A Simple Wrapper npm-module to use Google Cloud Firestore DB with Caching enabled on requests and responses

# How to use?

`
import { Database } from 'firestore-cache';

const db = new Database({
serviceAccKeyFilePath: '../serviceAccountKey.json',
cache_max_age: 10000,
cache_allocated_memory: 100
});

`
