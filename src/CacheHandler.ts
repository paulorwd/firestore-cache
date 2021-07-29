// import sizeof from 'object-sizeof';
import { MemoryHelper } from './utils/MemoryHelper';
export class CacheHandler {
  cacheObj: {};
  getDate: Date;
  cache_max_age: number;
  allocated_memory: number;

  constructor(miliseconds = 3600, cache_allocated_memory = 64) {
    this.cacheObj = {};
    this.getDate = new Date();
    // this.cache_max_age = minutesToLive * 60 * 1000;
    this.cache_max_age = miliseconds;
    this.allocated_memory = cache_allocated_memory;
    // console.log(this.cache_max_age);
  }
  set(key, data) {
    this.handleMemoryAllocation();
    this.getDate = new Date();
    this.cacheObj[key] = data;
    // console.log(
    //   `Setting Cache Data ${JSON.stringify(key)}`,
    //   this.cacheObj[key]
    // );
    // console.log('All the cache', this.cacheObj);
  }
  get(key) {
    this.handleMemoryAllocation();
    // console.log('is Cache Expired ?', this.isCacheExpired());
    if (!this.isCacheExpired() && this.cacheObj !== undefined) {
      // console.log('From Cache', this.cacheObj[key] ? this.cacheObj[key] : '');

      return this.cacheObj[key];
    } else {
      // console.log('Cache Expired !');
      return false;
    }
  }
  delete(key) {
    this.handleMemoryAllocation();
    delete this.cacheObj[key];
  }
  isCacheExpired() {
    return Date.now() > this.getDate.getTime() + this.cache_max_age;
  }
  flushCache() {
    this.cacheObj = {};
  }

  getAllCache() {
    return this.cacheObj;
  }
  handleMemoryAllocation() {
    const sizeOfTheCache = MemoryHelper.calculateObjSize(this.cacheObj);
    // console.log('Size of the cache', sizeOfTheCache);
    if (this.allocated_memory < sizeOfTheCache) {
      console.log('Allocated Memory Exeeded in Cache... Flushing Cache');
      this.flushCache();
    }
  }
}
