<<<<<<< HEAD
# Commiter

Commit on any date you desire

![image](https://www.uplooder.net/img/image/34/ddb1817a64f74cef39f96bf46d1bfe1e/Commiter.png)

[Generate a personal access token](https://github.com/settings/tokens?type=beta) on GitHub and copy it. (need public repo access.)

## Usage

To start the script clone the project 
```bash
git clone git@github.com:mawsyh/commiter.git
```

execute the following command in your terminal:
```bash
node commiter.js
```

You will be prompted to enter your GitHub credentials and desired date range:
    GitHub username
    GitHub access token
    Repository name (make sure the repository already exists on your GitHub account)
    Start date (in YYYY-MM-DD format)
    End date (in YYYY-MM-DD format)


Inspired by [antfu's 1990-script](https://github.com/antfu/1990-script)



## Explanations

This project works on the way `git` records commit. Whenever you commit something, `git` puts an `Unix Timestamp` on it to record when you committed it. An [`Unix Timestamp`](https://www.unixtimestamp.com/) is the way computers store the current time. An `Unix timestamp` is a `32-bit` number which stores the number of seconds that has passed from January 1st, 1970 at UTC, the `Unix Epoch`.



## How to get access token

Select the repository you want to commit on
![image](https://www.uplooder.net/img/image/37/ce523aca47bb0dd1092f78cf94f51e5b/Screenshot-2024-01-04-121034.png)

Only Contents access is needed here
![image](https://www.uplooder.net/img/image/46/df5bb47d01f0cec3cd206ff2782d4cdc/Screenshot-2024-01-04-121116.png)

Copy the created access token
![image](https://www.uplooder.net/img/image/14/14771a720fbec81a7b4be8f5caca96b6/Screenshot-2024-01-04-121414.png)
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> ui
