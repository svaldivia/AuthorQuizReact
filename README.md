# AuthorQuizReact
Author Quiz Tutorial from Pluralsight. This repo was initially based out of the React Screencast from Pluralsight; however, I made some modifications after finishing it.

##My Improvements
 - Updated the React.js implementation to latest version.
 - Included npm to include modules.
 - Included browserify to bundle jsx and React.
 - Included the server provided by the React.js tutorial (Uses Flask) and modified it to accept json.
 - Changed the Author quiz implementation to get data from the python server and use the json payload to load the components.
 - Created a form to add more authors and their books to the quiz.

##To Run Code:
**To bundle js files with browserify**
`browserify -t babelify js/app.js -o bundle.js`

**To run server**
`python server.py`

##To Do
 - Improve flow between views
 - Fix some styling issues
 - Fix npm modules and remove from repo
