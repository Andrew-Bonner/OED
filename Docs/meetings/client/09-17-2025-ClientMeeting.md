September 17, 2025

Agenda
- Discuss problems we would like to address first (1, 3) and any priorities 
- Go over group roles relating to the project
- Find out what we can talk about in our presentations vs can not
- Ask for clarification regarding the preferred units

Problem 1: Insufficient Access Controls (High Priority)
- A solution is currently in place and believed to be correct
- Mentor explained the need for a test that validates each route's ACL
- The testing framework is chai/mocha 
- Ideal test would iterate through each route with each user to validate authorized vs unauthorized access

Problem 3: Cross-Site Scripting (Medium Priority)
- A solution has already been proposed but never implemented using the dompurify library 
- It needs to sanitize input if it matches potential malicious indicators
- It will also need a test to validate
- Start by cherry picking the previous groups pull request and build off it

Group Roles
- Mentor mentioned they are currently fine, however, they will most likely change depending on the issue
- Mentor suggested splitting into two groups because six on one issue would be too many people touching the same code

Additional notes
- Download and familiarize Gitlens
