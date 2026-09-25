#!/usr/bin/env bash
# Run the Privacy Reviewer mode on a diff file locally.
# Usage: scripts/review-local.sh test/fixtures/leaky.diff
set -euo pipefail

if [ $# -ne 1 ] || [ ! -f "$1" ]; then
  echo "Usage: $0 <diff-file>" >&2
  exit 1
fi

diff_contents=$(cat "$1")

bob run --mode privacy-reviewer -f json --accept-license \
  "Review this pull request diff for sensitive data leaks. The repository is in the current directory. Diff: ${diff_contents}"
