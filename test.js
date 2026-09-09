const app = require("./server");

async function runTests() {
  console.log("Running application tests...");

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    const health = await healthResponse.json();

    if (!healthResponse.ok || health.status !== "UP") {
      throw new Error("Health endpoint test failed");
    }

    const pageResponse = await fetch(baseUrl);
    const page = await pageResponse.text();

    if (!pageResponse.ok || !page.includes("DevOps Shack")) {
      throw new Error("UI route test failed");
    }

    const migrationResponse = await fetch(`${baseUrl}/api/migration`);
    const migration = await migrationResponse.json();

    if (!migrationResponse.ok || migration.stages.length !== 6) {
      throw new Error("Migration API test failed");
    }

    console.log("All tests passed");
  } finally {
    server.close();
  }
}

runTests().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
