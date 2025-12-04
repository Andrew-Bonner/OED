October 8, 2025

Agenda
- Discuss a the Issue 2 solution for group 2 (Goals, what mentor wants) for Issue 2
- Discuss Issue 1 test implementation for group 1 (forming the test, organizing the routes in a format)

Group 1 
- To put all the routes in a organized format, create a json file with listed routes
- Maybe use a grep function or manually search through the route files to find each route
- The route file will be tasked to Oye
- Burpsuite does not need to be used to show this issue since the solution has already been completed
- Slow down, focus soley on the admin test right now
- Test to see if they can access all routes properly
- Determine what status codes = success (currently 200, 202 = success, 400+ = failure)
*Update: the status codes actually vary, becasue soem will return a 403 where it actaully passes
validation but fails due to some kind of improper message body*

Group 2
- Option 1: The install script will check enviroment variable default values are, if a password is not changed, somethign should prompt the user to change their password
    - This option would also open up a new issue regarding the way OED sets up it's docker file and install because this would increase the complexity of setting up the development OED which we DO NOT want
    - Suggested: opening a new issue specifcally for a seperate docker file that can be implmented later
    - Action: Investigate what things possible need to change in order for this to happen
- Option 2: Seperate from the current way OED is installed and find a new existing installation system where a form would be filled out during application prompting the change
- Mentor recommended option 1 for now since it is a faster solution with less implmentation but would be open to revisit later on

Additonal notes
- Mentor mentioned further splitting up the groups moving Oye, Brian, and Krista into other issues
