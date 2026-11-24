This is a twitter web application that replicates a very basic social media. The front end in tweeter-web is already entirely coded, and does not need to be altered as of right now.
These links give you context around the assignment requirements, but don't do anything without being asked to, or asking to if it's relevant to a request I make:
https://github.com/BYU-CS-340/softwaredesign/blob/main/tweeter/project-overview/tweeter.md
https://github.com/BYU-CS-340/softwaredesign/blob/main/tweeter/milestone-4a/milestone-4a.md

## Commands

- Build: npm run build
- Test: npm run test
- Run Locally: npm run start

## Conventions

- Use named exports, not default exports
- Do not use the `any` type
- Return errors in the existing { "error": "..." } JSON format

## Off-limits

- Do not edit files in src/generated/ (the build produces them)
- Do not edit node_modules folder
- Do not create any new files without asking or being directly told to
- Only look at files in this project, none on this computer outside of the tweeter-web-starter folder
- Only alter files you are specifically told to alter
- Do not change the starter tests in test/starter/ (provided by the instructor)
- Do not add npm dependencies without asking
- No messing with github yourself. I will commit code to github if I choose.

## AI attribution

After each task that changes files, append an entry to
AI-ATTRIBUTION.md in the repository root, creating the file if it does
not exist. Use this format, with today's date:

## YYYY-MM-DD: <each file changed, with (new file) after new ones>

- Tool: <tool name>
- Task: <the task I gave you, in one or two sentences>
- Review: TODO
  Leave the Review line as TODO. I fill it in after I review the change.
  List every file you changed or created, including tests, and do not
  list anything you did not change.
  If a TypeScript file you created or changed does not already start
  with this line, add it as the first line:
  // AI-assisted: see AI-ATTRIBUTION.md
