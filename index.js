#!/usr/bin/env node
import chalk from "chalk"
import inquirer from "inquirer";
import { mkdirSync, rmdir, writeFile } from "fs";
import { execSync } from 'child_process';

console.log(chalk.bgCyan("test"))
execSync('git init');

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const content = `
# Commiter

Commiter - https://github.com/mawsyh/commiter
`;

const answer = await inquirer.prompt([
    {
        name: "username",
        type: 'input',
        message: "Enter your Github username:"
    },
    {
        name: "accessToken",
        type: 'input',
        message: "Enter yout Github Access token:"
    },
    {
        name: "repository",
        type: 'input',
        message: "Enter yout Github repository name:"
    },
    {
        name: "startYear",
        type: "number",
        default: year,
        message: "Enter starting year [YYYY]:"
    },
    {
        name: "startMonth",
        type: "number",
        default: month,
        message: "Enter starting month [MM]:"
    },
    {
        name: "startDay",
        type: "number",
        default: day,
        message: "Enter starting day [DD]:"
    },
    {
        name: "endYear",
        type: "number",
        default: year,
        message: "Enter ending year [YYYY]:"
    },
    {
        name: "endMonth",
        type: "number",
        default: month,
        message: "Enter ending month [MM]:"
    },
    {
        name: "endDay",
        type: "number",
        default: day,
        message: "Enter ending day [DD]:"
    },
])

await mkdirSync(answer.repository);
process.chdir(answer.repository);

const startDate = new Date(answer.startYear, answer.startMonth - 1, answer.startDay);
const endDate = new Date(answer.endYear, answer.endMonth - 1, answer.endDay);

for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const isoString = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}.000Z`;
    await writeFile('README.md', content, (err) => {
        if (err) throw err;
    });
    execSync("git add .");
    execSync(`GIT_AUTHOR_DATE="${isoString}"`);
    execSync(`GIT_COMMITTER_DATE="${isoString}"`);
    execSync(`git commit -m "committed on ${isoString}"`, (err) => {
        console.log("Error happend:", err)
    });
}

console.log(process.cwd());
execSync(`git remote add origin https://${answer.accessToken}@github.com/${answer.username}/${answer.repository}.git`);
execSync('git branch -M main');
execSync('git push -u origin main -f');
process.chdir('..');
rmdir(answer.repository)
