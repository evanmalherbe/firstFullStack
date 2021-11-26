// HyperionDev Full Stack Web Development Bootcamp - Express task - Level 2 - Task 19 - Compulsory task - Express

//Import the express module
const express = require('express');

/* Create object called "app". It represents the Express application and has important method like get() and listen() 
that we will need to use */
const app = express()

// Import the file system module
const fileHandler = require('fs');

// use process.env to get the port number from the environmental variables instead of hard coding it here
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

// Added this because, in production, Express needs to serve up resources that have been built from the React app.
if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*', (req,res) => 
        {res.sendFile(path.resolve(__dirname, 'frontend', 'build','index.html'));
    });
}

// Include Body Parser middleware so Express server can access content that is passed in the body of the HTTP request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Write message to screen when user lands on root url: http://localhost:8080/
app.get('/', function (req, res) {
    res.json({
        "message": "Welcome, traveler! Navigate to http://localhost:8080/show-projects to see the Web Projects"
    });
});

// Display contents of Web Projects array of objects to screen when user navigates to /show-projects url
app.get('/show-projects', (req, res) => {

    // read contents of file and send to frontend if no error, else send error message
    fileHandler.readFile('webProject.json', (err, data) => {
        if (err) {
            // If error, send error message
            res.send({"message":"File not found."});
        } else {
            // Else send data
            res.send({"message": `${data}`});
        }
    });
});

/* The following website helped me with the array methods in this task:
https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/ 
*/

/*
Create route handler for POST request. Takes data user enters into post request form, creates object from it, then uses 
"push()" to add object to array of objects. Finally, it overwrites the "webProject.json" file with the updated array. */
app.post('/create-project', (req, res) => {

    // First read file so we can create an array from the contents
    fileHandler.readFile('webProject.json', (err, data) => {

        // If error, send error message
        if (err) res.send({"message":"File not found."});

        /* Create array of objects from data in "webProject.json" file. Remember to parse data first. This website helped me to do this: https://www.w3schools.com/js/js_json_parse.asp */
        let initialArray = JSON.parse(data);

        // Create new object from data in post request (from info user typed into form)
        let newObject = {
            "id": req.body.id,
            "title": req.body.title,
            "description": req.body.desc,
            "url": req.body.url
        };

        // Add new object to array
        initialArray.push(newObject);

        /* Stringify array. Was reminded how to do this here:
        https://www.w3schools.com/js/js_json_stringify.asp 
        
        Include parameters to beautify a bit */
        let finalArray = JSON.stringify(initialArray, null, 2);

        // Overwrite file with updated, stringified array
        fileHandler.writeFile('webProject.json', finalArray, (err) => {
            if (err) throw err;
            // Send msg to say we succeeded
            res.send({"message":"File updated!"});
        });
       
     // End of fileHandler.readFile and chained callback - fileHandler.writeFile
    });

 // End of app.post route handler
});

/* Create DELETE route handler that removes a web Project item with the id that the user specifies in their request (i.e. a specific object from the array of objects). */
app.delete('/delete-project', (req, res) => {

    // Read file so we can create an array from the contents
    fileHandler.readFile('webProject.json', (err, data) => {
        // If error, send error message
        if (err) res.send({"message":"File not found."});

        // Create array of objects from data in "webProject.json" file
        let initialArray = JSON.parse(data);

        /* Use splice to remove the object with the id specified by the user in the DELETE request (-1 to get the array
            index, since index starts at 0, not 1) */
        initialArray.splice(req.body.id - 1, 1);

        // Stringify final updated array with parameters to beautify a bit
        let finalArray = JSON.stringify(initialArray, null, 2);

        // Overwrite file with contents of updated and stringified array (finalArray)
        fileHandler.writeFile('webProject.json', finalArray, (err) => {
            // if error, create error msg
            if (err) throw err;
            // if success, send success msg
            res.send({"message":"File updated!"});
        });

     // fileHandler.readfile and chained callback function ends
    });

 // end of app.delete
});

/* Create PUT route handler that takes request from user and updates the data of an item with a specific id in the webProject array.  

This website helped me figure out how to use multiple parameters in a PUT request:
https://thewebdev.info/2021/07/12/how-to-accept-multiple-url-parameters-in-express-routes/ */
app.put('/update-project/:id', (req, res) => {

    // Read file so we can create an array from the contents
    fileHandler.readFile('webProject.json', (err, data) => {
        // if error, send error msg
        if (err) res.send({"message":"File not found."});

        // Create array of objects from data in "webProject.json" file (parse data into Javascript array)
        let initialArray = JSON.parse(data);

        // Minus one from the id the user entered so that it corresponds to the array index which starts at 0 not 1
        let id = req.params.id - 1;

        /* Update array items that user has provided new values for in form. */
        
        initialArray[id].title = req.body.title;
    
        initialArray[id].description = req.body.desc;
    
        initialArray[id].url = req.body.url;

        // Stringify array with parameters to beautify a bit
        let finalArray = JSON.stringify(initialArray, null, 2);

        // Overwrite file with updated and stringified array (finalArray)
        fileHandler.writeFile('webProject.json', finalArray, (err) => {
            // if error, create error msg
            if (err) throw err;
            // if success, send success msg
            res.send({"message":"File updated!"});
        });

     // End of fileHandler.readfile and chained callback - fileHandler.writeFile
    });
 // End of PUT request route handler
});

// Include what message to display if the user types in an incorrect url
app.get('*', function (req, res) {
    res.send({"message":"Sorry! Can't find that resource. Please check your URL."});
});
