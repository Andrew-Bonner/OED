Date: October 22. 2025

Agenda: 
- Discuss the different progress made with issues that each group member is contributing to
- ask questions relevant to the progress of those issues

Group 1 (Issue 1):
- there should be a spreadsheet of the expected status codes and compares them to the actual
- If the middleware validates the route, it will get the same result even if there is a bug
- Tests need to compare independently of OED
- Create the user first, then log in as that user
- when testing a user, they must log in and log back out at the end of the tests\
- Function to log in, and function to test for responses and compare them

Group 2 (Issue 2 and 3):
- How to format the copyright
- JWT secret token
-   Auto-generate the token using a cryptographic algorithm
-   Something like if file exists, read file for the token. If file does not exist, create file and generate token, then save token to file. (obviously a secret file or equivalent that is GitHub ignored)
-   This would prevent default tokens and prevent users from changing them.
- Change the comment for the passwords, devs can do as they wish, prod should be changed or it will be auto generated. Check the mail values, if they’re not none and they’re not the default values if OED_MAIL_METHOD is set.
- Start and end of the install check if it’s in prod mode, warn if they’re in dev with less security. If it’s a default password and you’re in prod mode, force a change.


