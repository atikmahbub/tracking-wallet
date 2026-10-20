// Tests only ever talk to a local, throwaway database.
const url = process.env.TEST_DATABASE_URL;
if (!url || !/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
  throw new Error("TEST_DATABASE_URL must point at a local database");
}
process.env.DATABASE_URL = url;
process.env.DIRECT_URL = url;
