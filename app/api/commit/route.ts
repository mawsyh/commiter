import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

type CommitRequestBody = {
  mode: string;
  username: string;
  accessToken: string;
  repository: string;
  startDate: string;
  endDate: string;
  maxCommits: number;
  ratios: Record<string, number>;
  appearProbabilities: Record<string, number>;
  days: Record<string, number>;
};

export async function POST(req: NextRequest) {
  try {
    const body: CommitRequestBody = await req.json();

    const {
      username,
      accessToken,
      repository,
      days,
    } = body;

    // Helper functions
    const randomNumber0to59 = (): string =>
      Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0");

    const performClone = (repoPath: string, repoUrl: string) => {
      if (fs.existsSync(repoPath)) {
        fs.rmSync(repoPath, { recursive: true, force: true });
      }
      execSync(
        `git clone --depth 1 --filter=blob:none --no-checkout ${repoUrl} ${repoPath}`
      );
    };

    const performCommit = (
      repoPath: string,
      day: Date,
      commitMessage: string
    ) => {
      const formattedDate = `${
        day.toISOString().split("T")[0]
      }T12:${randomNumber0to59()}:${randomNumber0to59()}`;
      const env = {
        ...process.env,
        GIT_AUTHOR_DATE: formattedDate,
        GIT_COMMITTER_DATE: formattedDate,
      };

      // Write unique content to README.md to ensure a change
      const uniqueContent = `${commitMessage} ${formattedDate}`;
      fs.writeFileSync(path.join(repoPath, "README22.md"), uniqueContent, {
        flag: "a",
      }); // Append mode
      execSync(`git add .`, { cwd: repoPath });
      execSync(`git commit -m "${uniqueContent}"`, { cwd: repoPath, env });
    };

    const repoPath = path.join(process.cwd(), repository);
    const repoUrl = `https://${accessToken}@github.com/${username}/${repository}.git`;

    performClone(repoPath, repoUrl);
    for (const [dateString, commitCount] of Object.entries(days)) {
      const day = new Date(dateString);

      for (let i = 0; i < commitCount; i++) {
        const commitMessage = `Committed on ${dateString}`;
        performCommit(repoPath, day, commitMessage);
      }
    }

    // Push to GitHub
    execSync("git push --verbose", {
      cwd: repoPath,
    });

    return NextResponse.json(
      { message: "Commits successfully pushed to GitHub!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json({ error: `An error occurred: ` }, { status: 500 });
  }
}
