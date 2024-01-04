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
node <script-name>.js
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
