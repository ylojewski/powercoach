#!/usr/bin/env bash

issue_commit() {
  local repo issue title branch
  [[ $# -eq 1 && "${1:-}" =~ ^[1-9][0-9]*$ ]] || return 1
  repo=$(git remote get-url origin) || return
  repo="${repo##*github.com[:/]}"
  repo="${repo%.git}"
  issue=$(curl -fsS -H "Authorization: Bearer ${GITHUB_TOKEN:?Définis GITHUB_TOKEN}" \
    "https://api.github.com/repos/$repo/issues/$1") || return
  title=$(printf '%s\n' "$issue" | sed -nE \
    's/^  "title": "([a-z]+\([a-z]+\): .*)",$/\1/p')
  [[ -n "$title" ]] || return 1
  branch=$(git symbolic-ref --short HEAD) || return
  [[ "$branch" =~ ^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)/[a-z]+/[A-Za-z0-9_-]+$ ]] || return 1
  git commit -m "$title" -m "Closes #$1"$'\n'"From $branch"
}

[[ "${BASH_SOURCE[0]:-}" != "$0" ]] || issue_commit "$@"
