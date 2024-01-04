// Import required modules
const readline = require("readline");
const { execSync } = require("child_process");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function performGitOperations({
  username,
  accessToken,
  repository,
  startDate,
  endDate,
}) {
  const repoPath = `${process.cwd()}/${repository}`;
  const repoUrl = `https://${accessToken}@github.com/${username}/${repository}.git`;

  if (fs.existsSync(repoPath)) {
    const answer = await ask(
      `The directory '${repository}' already exists. Would you like to remove it and continue? [y/N]: `
    );
  
    if (answer.toLowerCase() === 'y') {
      try {
        fs.rmSync(repoPath, { recursive: true, force: true });
        console.log(`The directory '${repository}' has been removed.`);
      } catch (err) {
        console.error(`Error while removing the directory: ${err}`);
        process.exit(1);
      }
    } else {
      console.log("Operation cancelled by the user.");
      process.exit(0);
    }
  }

  execSync(`git clone ${repoUrl} ${repoPath}`);

  for (
    let day = new Date(startDate);
    day <= new Date(endDate);
    day.setDate(day.getDate() + 1)
  ) {
    let formattedDate = day.toISOString().substring(0, 10) + `T12:${randomNumber0to59()}:${randomNumber0to59()}`;
    let commitMessage = `Committed on ${formattedDate}`;
    let readmeContent = `${commitMessage} \nCommitter - https://github.com/${username}/${repository}`;
    fs.writeFileSync(`${repoPath}/README.md`, readmeContent);
    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: formattedDate,
      GIT_COMMITTER_DATE: formattedDate,
    };
    execSync(`git add .`, { cwd: repoPath });
    execSync(`git commit -m "${commitMessage}"`, { cwd: repoPath, env });
  }
  execSync(`git push`, {
    cwd: repoPath,
    env: { ...process.env, GITHUB_TOKEN: accessToken },
  });

  console.log(
    `Committed from ${startDate} to ${endDate}. Check out your profile: https://github.com/${username}`
  );
  process.exit(0)
}

function randomNumber0to59() {
    return Math.floor(Math.random() * 60).toString().padStart(2, '0');
}

async function main() {
  const username = await ask("Enter your GitHub username: ");
  const accessToken = await ask("Enter your GitHub access token: ");
  const repository = await ask("Enter your GitHub repository name: ");
  const startDate = await ask("Enter start date (YYYY-MM-DD): ");
  const endDate = await ask("Enter end date (YYYY-MM-DD): ");
  await performGitOperations({
    username,
    accessToken,
    repository,
    startDate,
    endDate,
  });
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
