const readline = require("readline");
const { execSync } = require("child_process");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function performClone({ repository, repoPath, repoUrl }) {
  if (fs.existsSync(repoPath)) {
    const answer = await ask(
      `The directory '${repository}' already exists. Would you like to remove it and continue? [y/N]: `
    );

    if (answer.toLowerCase() === "y") {
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

  console.log(`git clone ${repoUrl} ${repoPath}`);
  execSync(`git clone ${repoUrl} ${repoPath}`);
}

async function performCommit({ username, repository, repoPath, day }) {
  let formattedDate =
    day.toISOString().substring(0, 10) +
    `T12:${randomNumber0to59()}:${randomNumber0to59()}`;
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

async function performGitOperationsStochastic({
  username,
  accessToken,
  repository,
  startDate,
  endDate,
  ratios,
  appearProbabilities,
  maxCommits,
}) {
  const repoPath = `${process.cwd()}/${repository}`;
  const repoUrl = `https://${accessToken}@github.com/${username}/${repository}.git`;
  await performClone({ repository, repoPath, repoUrl });
  var weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  for (
    let day = new Date(startDate);
    day <= new Date(endDate);
    day.setDate(day.getDate() + 1)
  ) {
    var day_week = weekDays[day.getDay()];
    var randomNum = Math.random();
    var ratio = ratios[day_week];
    var appearProbability = appearProbabilities[day_week];
    console.log(randomNum, appearProbability, day_week);
    if (appearProbability > randomNum) {
      var ratioRandom = getRandomNormalDistribution(ratio, 0.3);
      console.log(ratio, ratioRandom, maxCommits);
      var numCommits = Math.floor(ratioRandom * maxCommits);
      console.log(numCommits);
      if (numCommits > 0) {
        for (var i = 0; i < numCommits; i++) {
          performCommit({ username, repository, repoPath, day });
        }
        execSync(`git push`, {
          cwd: repoPath,
          env: { ...process.env, GITHUB_TOKEN: accessToken },
        });
      }
    }
  }

  console.log(
    `Committed from ${startDate} to ${endDate}. Check out your profile: https://github.com/${username}`
  );
  process.exit(0);
}

async function performGitOperationsConstant({
  username,
  accessToken,
  repository,
  startDate,
  endDate,
}) {
  const repoPath = `${process.cwd()}/${repository}`;
  const repoUrl = `https://${accessToken}@github.com/${username}/${repository}.git`;
  await performClone({ repository, repoPath, repoUrl });
  console.log(repository);
  for (
    let day = new Date(startDate);
    day <= new Date(endDate);
    day.setDate(day.getDate() + 1)
  ) {
    performCommit({ username, repository, repoPath, day });
  }
  execSync(`git push`, {
    cwd: repoPath,
    env: { ...process.env, GITHUB_TOKEN: accessToken },
  });

  console.log(
    `Committed from ${startDate} to ${endDate}. Check out your profile: https://github.com/${username}`
  );
  process.exit(0);
}

function randomNumber0to59() {
  return Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
}

function getRandomNormalDistribution(mean, standardDeviation) {
  console.log(mean, standardDeviation);
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * standardDeviation + mean;
}

async function main() {
  const mode = await ask("Enter the commit mode (random, fix): ");
  const username = await ask("Enter your GitHub username: ");
  const accessToken = await ask("Enter your GitHub access token: ");
  const repository = await ask("Enter your GitHub repository name: ");
  const startDate = await ask("Enter start date (YYYY-MM-DD): ");
  const endDate = await ask("Enter end date (YYYY-MM-DD): ");
  if (mode === "fix") {
    await performGitOperationsConstant({
      username,
      accessToken,
      repository,
      startDate,
      endDate,
    });
  }
  if (mode !== "fix") {
    var weekDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    var ratios = {};
    var appearProbabilities = {};
    const maxCommits = await ask("Enter the maximum number of commits: ");
    for (var day of weekDays) {
      const ratio = parseFloat(
        await ask("Enter the " + day + " ratio to max commits (0 to 1):")
      );
      const appearProbability = parseFloat(
        await ask("Enter the " + day + " appear probability (0 to 1): ")
      );
      ratios[day] = ratio;
      appearProbabilities[day] = appearProbability;
    }
    await performGitOperationsStochastic({
      username,
      accessToken,
      repository,
      startDate,
      endDate,
      ratios,
      appearProbabilities,
      maxCommits,
    });
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
