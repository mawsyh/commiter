#!/usr/bin/env sh

_() {
  read -p "Enter your Github username: " USERNAME
  read -p "Enter yout Github Access token: " ACCESS_TOKEN
  read -p "Enter yout Github repository name: " REPOSITORY
  read -p "Enter starting year [YYYY]: " START_YEAR
  read -p "Enter starting month [MM]: " START_MONTH
  read -p "Enter starting day [DD]: " START_DAY
  read -p "Enter ending year [YYYY]: " END_YEAR
  read -p "Enter ending month [MM]: " END_MONTH
  read -p "Enter ending day [DD]: " END_DAY

  [ -z "$USERNAME" ] && exit 1
  [ -z "$ACCESS_TOKEN" ] && exit 1
  [ -z "$START_YEAR" ] && exit 1
  [ -z "$START_MONTH" ] && exit 1
  [ -z "$START_DAY" ] && exit 1
  [ -z "$END_YEAR" ] && exit 1
  [ -z "$END_MONTH" ] && exit 1
  [ -z "$END_DAY" ] && exit 1
  [ ! -d $REPOSITORY ] && mkdir $REPOSITORY
  cd "${REPOSITORY}" || exit
  git init

  START_EPOCH=$(date +%s -d "${START_YEAR}-${START_MONTH}-${START_DAY}")
  END_EPOCH=$(date +%s -d "${END_YEAR}-${END_MONTH}-${END_DAY}")

  while [ $START_EPOCH -le $END_EPOCH ]; do
    DATE=$(date +%Y-%m-%d -d "@${START_EPOCH}")
    HOUR=$(shuf -i 0-23 -n 1)
    MINUTE=$(shuf -i 0-59 -n 1)
    SECOND=$(shuf -i 0-59 -n 1)
    TIMESTAMP="${DATE}T${HOUR}:${MINUTE}:${SECOND}"
    echo "${TIMESTAMP} Commiter - https://github.com/mawsyh/commiter" \
    >README.md
    git add .
    GIT_AUTHOR_DATE="${TIMESTAMP}" \
    GIT_COMMITTER_DATE="${TIMESTAMP}" \
    git commit -m "commited on ${TIMESTAMP}"
    START_EPOCH=$((START_EPOCH + 86400))
  done

  git remote add origin "https://${ACCESS_TOKEN}@github.com/${USERNAME}/${REPOSITORY}.git"
  git branch -M main
  git push -u origin main -f
  cd ..
  rm -rf "${REPOSITORY}"

  echo
  echo "It should be all done, check out your profile please: https://github.com/${USERNAME}"
} && _

unset -f _