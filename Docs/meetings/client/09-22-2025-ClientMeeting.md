September 22, 2025
Weekly meeting was rescheduled to Monday for this week due to a time conflict

Agenda 
- Discuss questions created during the last team meeting
- Explain the git workflow of OED since it is a larger project 
- Further discuss problems 1 and 3 since we have had time to review

Meeting Questions: 
1. How do we view merges
2. How do we get the branch from the group who did 1488 for issue 3 and merge it with ours
3. Clarify his comment on 1488 and further explain what the issue is
4. (Problem 1) What security level should each of these functionalities be accessible to (Page 20)
5. (Problem 1) Does the system/how does the system tell the access level of the user
6. (Problem 1) What other areas could have issues (Page 20)

General OED Practices
- A pull = combination of fetch + merge.
- All work must be kept separate in branches.
- When continuing older work, create a new PR and reference the old PR.
- Groups manage their own branches to avoid conflicts.
- As a group we need to decide how to coordinate:
  - Forks
  - Upstream merges
  - Branch syncing
  - PR review flow

Getting Work From Other Teams (Issue 1488 Branch) 
*Update: We found cherry picking files to be much easier*
Steps discussed:
1. Go to the branch you want to pull into your repo.
2. Copy the code URL of the repo/branch.
3. In VS Code, click the remote cloud icon.
4. Click + to add a remote.
5. Paste the URL.
6. Click Add or Add and Fetch to download info.
7. Fetch from upstream and merge into your development branch.

Problem 1: Access Control 
Goal:
- Create one working test that:
  - Fetches a specific route
  - Gets the required authorized users from user.role
  - Systematically tests route access for each user

Problem 2: Cross-Site Scripting 
1st Goal:
- The package.json and package-lock do not match 
- Previous team must have not installed the packages using the npm install or not correctly
- Find differences and resolve them
2nd Goal: 
- Review the current state of the code and finish the implementation and test
