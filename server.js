const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "jenkins-github-migration-demo",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/migration", (req, res) => {
  res.json({
    title: "Jenkins to GitHub Actions Migration",
    owner: "DevOps Shack",
    status: "Demo Ready",
    stages: ["Source", "Test", "Build", "Security", "Container", "Deploy"]
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`DevOps Shack migration demo running on port ${port}`);
  });
}

module.exports = app;
