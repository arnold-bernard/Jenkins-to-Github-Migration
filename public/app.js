const runButtons = [
  document.querySelector("#run-demo"),
  document.querySelector("#run-demo-secondary"),
].filter(Boolean);

const stages = [...document.querySelectorAll(".stage-card")];
const terminal = document.querySelector("#terminal-output");

const logs = [
  "Initializing GitHub Actions runner...",
  "Checking out repository...",
  "Installing Node.js dependencies...",
  "Running unit tests...",
  "Building Docker image...",
  "Authenticating with Amazon ECR...",
  "Pushing image to ECR...",
  "Deploying application to EC2...",
  "Workflow completed successfully."
];

const stageLogs = [
  "Repository checked out.",
  "All tests passed.",
  "Docker image built.",
  "Security validation complete.",
  "Image pushed to Amazon ECR.",
  "Deployment completed."
];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function typeLine(text) {
  terminal.textContent += `\n$ ${text}`;
  terminal.scrollTop = terminal.scrollHeight;
}

async function runMigration() {
  runButtons.forEach(btn => btn.disabled = true);

  document.querySelector("#workflow")
    .scrollIntoView({ behavior: "smooth" });

  terminal.textContent = "Starting Jenkins → GitHub Actions migration...\n";

  stages.forEach(stage => {
    stage.classList.remove("running", "complete");
    stage.querySelector("span").textContent = "Ready";
  });

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];

    stage.classList.add("running");
    stage.querySelector("span").textContent = "Running";

    await typeLine(logs[i]);
    await wait(700);

    stage.classList.remove("running");
    stage.classList.add("complete");
    stage.querySelector("span").textContent = "Passed";

    await typeLine(stageLogs[i]);
  }

  await typeLine(logs[logs.length - 1]);

  runButtons.forEach(btn => btn.disabled = false);
}

/* Theme Toggle */

const themeToggle = document.querySelector("#theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent =
      document.body.classList.contains("light-mode") ? "☀️" : "🌙";
  });
}

runButtons.forEach(btn =>
  btn.addEventListener("click", runMigration)
);