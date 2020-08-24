type DbT = {
  serviceAccKeyFilePath: string;
  cache_max_age: number;
  cache_allocated_memory: number;
};

type fbObj = {
  serviceAccKeyFilePath: string;
};

type docCollection = {
  collection: string;
  id: string;
  uuid?: string;
};

type docData = {
  [key: string]: string;
};

type readManyType = {
  collection: string;
  filter?: filterType;
};

type filterType = {
  fieldName: string;
  fieldValue: string;
};

export { DbT, docCollection, docData, readManyType, fbObj };
