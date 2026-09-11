const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 8080;

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"]
      }
    }
  })
);
app.use(compression());

// Serve frontend
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

// Project metadata API
app.get("/api/migration", (req, res) => {
  res.json({
    title: "Jenkins → GitHub Actions Migration",
    owner: "Arnold Bernard",
    project: "CI/CD Migration Command Center",
    cloud: "AWS EC2",
    registry: "Amazon ECR",
    runtime: "Docker",
    pipeline: [
      "Checkout",
      "Tests",
      "Docker Build",
      "Security",
      "ECR Push",
      "Deploy"
    ]
  });
});

// Fallback route
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
=============================================
 CI/CD Migration Command Center
---------------------------------------------
 Owner   : Arnold Bernard
 Server  : http://localhost:${PORT}
 Health  : http://localhost:${PORT}/health
 API     : http://localhost:${PORT}/api/migration
=============================================
`);
  });
}

module.exports = app;