import { createSchema } from "./schema";
import { seedData } from "./seed";

async function main() {
  console.log("Running migrations...");
  await createSchema();
  console.log("Schema created!");
  await seedData();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
