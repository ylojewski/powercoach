#!/usr/bin/env bash

issue_checkout() {
  local repo issue branch
  [[ $# -eq 1 && "${1:-}" =~ ^[1-9][0-9]*$ ]] || return 1
  repo=$(git remote get-url origin) || return
  repo="${repo##*github.com[:/]}"
  repo="${repo%.git}"
  issue=$(curl -fsS -H "Authorization: Bearer ${GITHUB_TOKEN:?Définis GITHUB_TOKEN}" \
    "https://api.github.com/repos/$repo/issues/$1") || return
  branch=$(printf '%s\n' "$issue" | sed -nE \
    's/^  "title": "([a-z]+)\(([a-z]+)\): (.*)",$/\1\/\2\/\3/p' \
    | tr '[:upper:] ' '[:lower:]-')
  [[ -n "$branch" ]] && git switch -c "$branch"
}

[[ "${BASH_SOURCE[0]:-}" != "$0" ]] || issue_checkout "$@"
