const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 8080;

app.disable("x-powered-by");
app.use(helmet());
app.use(compression());

app.use(express.static(path.join(__dirname, "public")));

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "jenkins-github-actions-migration",
    owner: "Arnold Bernard",
    version: "1.0.0",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Project metadata
app.get("/api/migration", (req, res) => {
  res.json({
    title: "Jenkins → GitHub Actions Migration",
    owner: "Arnold Bernard",
    status: "Portfolio Project",
    cloud: "AWS EC2",
    registry: "Amazon ECR",
    runtime: "Docker",
    pipeline: [
      "Source",
      "Test",
      "Build",
      "Security",
      "Container",
      "Deploy"
    ]
  });
});

// Catch-all for SPA behavior
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
========================================
 Jenkins → GitHub Actions Migration
----------------------------------------
 Owner : Arnold Bernard
 Server: http://localhost:${PORT}
 Health: http://localhost:${PORT}/health
========================================
`);
  });
}

module.exports = app;