const runButtons = [
  document.querySelector("#run-demo"),
  document.querySelector("#run-demo-secondary"),
].filter(Boolean);

const stages = [...document.querySelectorAll(".stage-card")];
const terminal = document.querySelector("#terminal-output");

const workflow = [
  {
    stage: "Checkout",
    command: "git checkout main",
    result: "Repository checked out successfully."
  },
  {
    stage: "Tests",
    command: "npm test",
    result: "All unit tests passed."
  },
  {
    stage: "Docker Build",
    command: "docker build -t migration-demo .",
    result: "Docker image built successfully."
  },
  {
    stage: "Security",
    command: "Running security validation...",
    result: "No critical vulnerabilities detected."
  },
  {
    stage: "ECR Push",
    command: "docker push <aws-ecr>",
    result: "Image pushed to Amazon ECR."
  },
  {
    stage: "Deploy",
    command: "Deploying to AWS EC2...",
    result: "Application deployed successfully."
  }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function resetPipeline() {
  terminal.textContent = "";

  stages.forEach(stage => {
    stage.classList.remove("running", "complete");
    stage.querySelector("span").textContent = "READY";
  });
}

async function typeLine(text, delay = 18) {
  const line = document.createElement("div");
  terminal.appendChild(line);

  for (const char of text) {
    line.textContent += char;
    terminal.scrollTop = terminal.scrollHeight;
    await sleep(delay);
  }
}

async function runMigration() {

  runButtons.forEach(btn => btn.disabled = true);

  resetPipeline();

  document.querySelector("#workflow")
    .scrollIntoView({ behavior: "smooth" });

  await typeLine("> Booting migration environment...");
  await sleep(300);

  await typeLine("> Authenticating AWS IAM Role...");
  await sleep(300);

  await typeLine("> Docker daemon connected.");
  await sleep(250);

  await typeLine("> GitHub Actions runner initialized.");
  await sleep(450);

  for (let i = 0; i < workflow.length; i++) {

    const stage = stages[i];

    stage.classList.add("running");
    stage.querySelector("span").textContent = "RUNNING";

    await typeLine(``);
    await typeLine(`> Stage ${String(i + 1).padStart(2, "0")} | ${workflow[i].stage}`);
    await typeLine(`$ ${workflow[i].command}`, 14);

    await sleep(500);

    await typeLine(`✓ ${workflow[i].result}`, 10);

    stage.classList.remove("running");
    stage.classList.add("complete");
    stage.querySelector("span").textContent = "PASSED";

    await sleep(250);
  }

  await typeLine("");
  await typeLine("> Workflow Summary");
  await typeLine("✓ 6/6 stages completed.");
  await typeLine("✓ Jenkins → GitHub Actions migration successful.");
  await typeLine("> Deployment status: ONLINE");

  runButtons.forEach(btn => btn.disabled = false);
}

// Event listeners
runButtons.forEach(btn => btn.addEventListener("click", runMigration));

// Initial terminal message
if (terminal) {
  terminal.textContent =
`Waiting for migration...

Click "> start migration" to simulate a GitHub Actions workflow.`;
}

// Optional blinking cursor
const cursor = document.createElement("span");
cursor.textContent = "▋";
cursor.style.marginLeft = "4px";
cursor.style.animation = "blink 1s infinite";

if (terminal) terminal.appendChild(cursor);

// Inject blink animation
const style = document.createElement("style");
style.textContent = `
@keyframes blink {
  50% { opacity: 0; }
}

.stage-card.running {
  transform: translateY(-6px);
}

.stage-card.complete {
  transform: translateY(-2px);
}

button:disabled {
  opacity: .55;
  cursor: not-allowed;
}
`;
document.head.appendChild(style);