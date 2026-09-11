const app = require("./server");

async function runTests() {
  console.log("Running CI/CD Migration Command Center tests...\n");

  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Health Check
    const healthResponse = await fetch(`${baseUrl}/health`);
    const health = await healthResponse.json();

    if (!healthResponse.ok || health.status !== "UP") {
      throw new Error("Health endpoint failed");
    }

    if (health.owner !== "Arnold Bernard") {
      throw new Error("Health endpoint owner mismatch");
    }

    console.log("✓ Health endpoint");

    // Homepage Test
    const pageResponse = await fetch(baseUrl);
    const page = await pageResponse.text();

    if (!pageResponse.ok) {
      throw new Error("Homepage failed to load");
    }

    if (!page.includes("Arnold Bernard")) {
      throw new Error("Homepage branding not found");
    }

    if (!page.includes("CI/CD Migration Command Center")) {
      throw new Error("Command Center title missing");
    }

    console.log("✓ Homepage");

    // Migration API
    const migrationResponse = await fetch(`${baseUrl}/api/migration`);
    const migration = await migrationResponse.json();

    if (!migrationResponse.ok) {
      throw new Error("Migration API failed");
    }

    if (!Array.isArray(migration.pipeline)) {
      throw new Error("Pipeline data missing");
    }

    if (migration.pipeline.length !== 6) {
      throw new Error("Expected 6 pipeline stages");
    }

    if (migration.registry !== "Amazon ECR") {
      throw new Error("Registry value mismatch");
    }

    console.log("✓ Migration API");

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(" ALL TESTS PASSED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } finally {
    server.close();
  }
}

runTests().catch((error) => {
  console.error(`\n❌ ${error.message}`);
  process.exit(1);
});