const apiStatus = document.querySelector("#api-status");
const runButtons = [
  document.querySelector("#run-demo"),
  document.querySelector("#run-demo-secondary")
];
const stages = [...document.querySelectorAll(".stage-card")];
const deploymentTitle = document.querySelector("#deployment-title");
const deploymentCopy = document.querySelector("#deployment-copy");

async function checkHealth() {
  try {
    const response = await fetch("/health");
    const data = await response.json();

    if (!response.ok || data.status !== "UP") {
      throw new Error("API unavailable");
    }

    apiStatus.classList.add("online");
    apiStatus.querySelector("span:last-child").textContent = "API healthy";
  } catch {
    apiStatus.classList.add("offline");
    apiStatus.querySelector("span:last-child").textContent = "API offline";
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function runMigration() {
  runButtons.forEach((button) => {
    button.disabled = true;
  });

  document.querySelector("#workflow").scrollIntoView({ behavior: "smooth" });
  deploymentTitle.textContent = "Workflow running";
  deploymentCopy.textContent = "Migrating pipeline stages to GitHub Actions…";

  stages.forEach((stage) => {
    stage.classList.remove("running", "complete");
    stage.querySelector(".stage-state").textContent = "Ready";
  });

  for (const stage of stages) {
    stage.classList.add("running");
    stage.querySelector(".stage-state").textContent = "Running";
    await wait(520);
    stage.classList.remove("running");
    stage.classList.add("complete");
    stage.querySelector(".stage-state").textContent = "Passed";
  }

  deploymentTitle.textContent = "Migration demo completed";
  deploymentCopy.textContent = "All six GitHub Actions stages passed successfully.";

  runButtons.forEach((button) => {
    button.disabled = false;
  });
}

runButtons.forEach((button) => button.addEventListener("click", runMigration));
checkHealth();
