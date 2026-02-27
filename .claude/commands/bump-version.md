---
description: Bump the package version (major, minor, or patch)
argument-hint: major|minor|patch
allowed-tools: Read, Edit, Bash(node:*), Bash(git status), Bash(git checkout *), Bash(git add *), Bash(git commit *), Bash(git push *), Bash(gh pr create *), Bash(start *)
---

## Task

Bump the version in `package.json` according to the argument: `$ARGUMENTS`

The argument must be one of: `major`, `minor`, or `patch`.

Steps:
1. Run `git status --porcelain` to check for modified files. If there are any uncommitted changes, stop and tell the user to commit or stash them first. Do not proceed.
2. Read `package.json` to get the current version
3. Parse the version string (semver format: `MAJOR.MINOR.PATCH`)
4. Increment the appropriate component based on the argument:
   - `major`: increment MAJOR, reset MINOR and PATCH to 0
   - `minor`: increment MINOR, reset PATCH to 0
   - `patch`: increment PATCH only
5. Check out a new branch named `bump-version` using `git checkout -b bump-version`
6. Update the `version` field in `package.json` with the new version
7. Commit the change with `git add package.json` then `git commit -m "v<new-version>"` (e.g. `"v1.2.3"`)
8. Push the branch to the remote with `git push -u origin bump-version`
9. Create a PR using `gh pr create --title "v<new-version>" --body ""` (use the same version string as the commit message for the title, no body)
10. Open the PR URL in the browser using `start <pr-url>` (Windows)
11. Report the old version, new version, branch name, and PR URL to the user

If the argument is missing or not one of the valid values, tell the user the valid options and do not modify any files.
