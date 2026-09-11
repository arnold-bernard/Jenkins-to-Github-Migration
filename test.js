const app = require("./server");

async function runTests() {
  console.log("Running Jenkins → GitHub Actions Migration tests...");

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Health Check
    const healthResponse = await fetch(`${baseUrl}/health`);
    const health = await healthResponse.json();

    if (!healthResponse.ok || health.status !== "UP") {
      throw new Error("Health endpoint test failed");
    }

    if (health.owner !== "Arnold Bernard") {
      throw new Error("Health endpoint owner mismatch");
    }

    console.log("✓ Health endpoint passed");

    // Homepage Test
    const pageResponse = await fetch(baseUrl);
    const page = await pageResponse.text();

    if (!pageResponse.ok || !page.includes("Arnold Bernard")) {
      throw new Error("Homepage branding test failed");
    }

    console.log("✓ Homepage test passed");

    // Migration API Test
    const migrationResponse = await fetch(`${baseUrl}/api/migration`);
    const migration = await migrationResponse.json();

    if (!migrationResponse.ok) {
      throw new Error("Migration API request failed");
    }

    if (migration.pipeline.length !== 6) {
      throw new Error("Pipeline stage count mismatch");
    }

    if (migration.registry !== "Amazon ECR") {
      throw new Error("Registry value mismatch");
    }

    console.log("✓ Migration API passed");

    console.log("\nAll tests passed successfully.");
  } finally {
    server.close();
  }
}

runTests().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});