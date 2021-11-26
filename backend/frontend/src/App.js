import React from 'react';

// Import logo image
import logo from './animalLogo.png';

// Import Bootstrap components
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// Import custom stylesheet
import './App.css';

// Import bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css'

// Create class component for front end
class App extends React.Component {
  constructor(props) {
    super(props);

    // Define state variables
    this.state = {
      error: null,
      isLoaded: false,
      message: {"message": ""},

      postFormData: {"id": "", "title": "", "description": "", "url": ""},
      idInput: "",
      titleInput: "", 
      descInput: "",
      urlInput: "",

      putFormData: {"id": "", "title": "", "description": "", "url": ""},
      putIdInput: "",
      putTitleInput: "", 
      putDescInput: "",
      putUrlInput: "",

      deleteIdInput: {"id": ""}
        
    };

    // Binding to make "this" work
    this.handleChangeIdPost = this.handleChangeIdPost.bind(this);
    this.handleChangeTitlePost = this.handleChangeTitlePost.bind(this);
    this.handleChangeDescPost = this.handleChangeDescPost.bind(this);
    this.handleChangeUrlPost = this.handleChangeUrlPost.bind(this);

    this.handleChangeIdPut = this.handleChangeIdPut.bind(this);
    this.handleChangeTitlePut = this.handleChangeTitlePut.bind(this);
    this.handleChangeDescPut = this.handleChangeDescPut.bind(this);
    this.handleChangeUrlPut = this.handleChangeUrlPut.bind(this);

    this.handleChangeIdDelete = this.handleChangeIdDelete.bind(this);

    this.handleSubmitPost = this.handleSubmitPost.bind(this);
    this.handleSubmitPut = this.handleSubmitPut.bind(this);
    this.handleSubmitDelete = this.handleSubmitDelete.bind(this);

    this.createOutput = this.createOutput.bind(this);
    this.displayPage = this.displayPage.bind(this);
    this.formatData = this.formatData.bind(this);

}

// POST: Add form data to state variables as user enters it. One function per input field
handleChangeIdPost(event) {
  this.setState({idInput: event.target.value}, () => console.log("Id is: " + this.state.idInput))
}

handleChangeTitlePost(event) {
  this.setState({titleInput: event.target.value}, () => console.log("title is: " + this.state.titleInput))
}

handleChangeDescPost(event) {
  this.setState({descInput: event.target.value}, () => console.log("Description is: " + this.state.descInput))
}

handleChangeUrlPost(event) {
  this.setState({urlInput: event.target.value}, () => console.log("Url is: " + this.state.urlInput))
}

// PUT: Add form data to state variables as user enters it. One function per input field
handleChangeIdPut(event) {
  this.setState({putIdInput: event.target.value}, () => console.log("Id is: " + this.state.putIdInput));
}

handleChangeTitlePut(event) {
  this.setState({putTitleInput: event.target.value}, () => console.log("title is: " + this.state.putTitleInput));
}

handleChangeDescPut(event) {
  this.setState({putDescInput: event.target.value}, () => console.log("Description is: " + this.state.putDescInput));
}

handleChangeUrlPut(event) {
  this.setState({putUrlInput: event.target.value}, () => console.log("Url is: " + this.state.putUrlInput));
}

// DELETE: Add form input tp state variable.
handleChangeIdDelete(event) {
  this.setState({deleteIdInput: {"id": event.target.value}}, () => console.log("Id is: " + this.state.deleteIdInput))
}

/* HTTP Delete: When user clicks the "Delete Project" button, this function uses HTTP Delete to send the id of the project the user wants to delete to the backend route handler. It then removes the project with the correct id from the webProjects.json file. */
async handleSubmitDelete(event) {
  //console.log("deleteidinput is: " + this.state.deleteIdInput);
  try {
    let url = "/delete-project";
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.deleteIdInput),
    });
    const response_1 = await response.json();
    return alert("Success: ", response_1);
  } catch (error) {
    return console.log("Error: ", error);
  }

// End of handle submit delete function
}

/* HTTP PUT: When user clicks "Update Project" button, this function adds updated data from form to state variable, 
then uses HTTP PUT to send it to the backend Express route handler to add updated data to "webProject.json" file. 
The updated file contents is then displayed at the bottom of the page.*/
handleSubmitPut(event) {
  
      // Add form input to state variable
      this.setState({
        putFormData: {"id": this.state.putIdInput, 
        "title": this.state.putTitleInput, 
        "desc": this.state.putDescInput, 
        "url": this.state.putUrlInput
      }}, async () => {

      // Asyncronous callback function for setState. i.e. only do the below once "putFormData" variable has been set
      try {
        // Include id of object that must be updated in url
        let url = "/update-project/" + this.state.putIdInput;
        console.log("url is: " + url);

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // Send form data in body
          body: JSON.stringify(this.state.putFormData), 
        });

        // parses response to JSON
        const response_1 = await response.json(); 
        return alert("Success: ", response_1);
      } catch (error) {
          return console.log("Error: ", error);
      }

    // End of async callback function for setState
    });

// End of handle submit put function
}

/* HTTP POST: When user clicks "Create Project" button, this function adds data from form to state variable, then uses HTTP POST to send it to the backend Express route handler to add data to "webProject.json" file. The updated file contents is then displayed at the bottom of the page.  */
handleSubmitPost(event) {

// Add form data to state variable
 this.setState({
    postFormData: {
    "id": this.state.idInput, 
    "title": this.state.titleInput, 
    "desc": this.state.descInput, 
    "url": this.state.urlInput
  } }, async () => { 

      // Asynchronous callback function for setState. i.e. only do the below once "postFormData" variable has been set
      try {
     const response = await fetch("/create-project", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       // Send for data in body
       body: JSON.stringify(this.state.postFormData),
     });
     const response_1 = await response.json();
     return alert("Success: ", response_1);
   } catch (error) {
     return console.log("Error: ", error);
   }

  // End of async callback function for setState
  });

// End of handle submit post function
}

// Create lists from data in webProject.json file - fetched from backend server
formatData() {

  // Change data from server into an Javascript object with JSON.parse()
  let msg = JSON.parse(this.state.message);
  
  // If array has items in it, do the following
  if (msg.length !== 0) {

      // Use map() method to create list items for each object in array
      let items = msg.map(item => {
        return (
          <ul key={item.id}>
            <li><strong>Id: </strong> {item.id}</li>
            <li><strong>Title: </strong> {item.title}</li>
            <li><strong>Description: </strong> {item.description}</li>
            <li><strong>URL: </strong>{item.url}</li>
          </ul>
        );
      });
      return items;
  } else {
      return <p className="emptyFile">No projects in file.</p>;
  }

// End of formatdata function
}

// Function to fetch data from server
createOutput() {
 
  // If statement to check if data has been fetched yet. If so, don't do it again (can cause infinite loop otherwise)
  if (this.state.isLoaded === false) {
    console.log("getdata has started");
    // call fetch function to get "Web Project" data from Express API
    fetch("/show-projects")
    // use json method to convert JSON data into a Javascript object
    .then(res => res.json())
    // Deal with result by specifying what to do if successful or not. If success, save data to state variable, if not, 
    // create error message
    .then(
          (result) => {
              console.log("Result is: " + result.message);
              this.setState({
                  isLoaded: true,
                  message: result.message
              });
              
          },
          (error) => {
              this.setState({
                  isLoaded: true,
                  error
              });
          });

   // End of if statement to check if message data has already been fetched
  }

  // If statement to display error message if there was a problem, or call formatdata() function is successful.
  const { error, isLoaded, message } = this.state;
  if (error) {
      return <div>Error: {error.message}</div>;

  } else if (!isLoaded) {
      return <div>Loading...</div>;

  } else if (message !== undefined) { 
      
      return this.formatData();
    
  } else if (message === undefined) {
      return <p>No result yet. Hang in there.</p>
  } 
// End of createoutput function
}

/* function to display divs and form on page. Looked at this website to remind myself about Bootstrap Forms:
 https://react-bootstrap.netlify.app/components/forms/ */
displayPage() {
  
  return (
    <div className="app">
        <header className="header">
            <img className="logoImg" src={logo} alt="logo"/>
            <h1>Full Stack With React and Express</h1>
          </header>
         
            <div className="input">
            
            {/* Div with form for HTTP POST request - user enters info to create new "web project" */}
              <div className="postFormDiv">
                <p><b>HTTP POST:</b> Type in the values of a new web project to store</p>

                <Form id="postForm" onSubmit={this.handleSubmitPost}>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter id:</Form.Label>
                    <FormControl type="text" placeholder="id..." name="id" onChange={this.handleChangeIdPost}/>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter title:</Form.Label>
                    <FormControl type="text" placeholder="title..." name="title" onChange={this.handleChangeTitlePost}/>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter description:</Form.Label>
                    <FormControl type="text" placeholder="description..." name="description" onChange={this.handleChangeDescPost}/>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter URL:</Form.Label>
                    <FormControl type="text" placeholder="url..." name="url" onChange={this.handleChangeUrlPost} />
                  </FormGroup>

                  <Button variant="primary" type="submit">Create project</Button>
                </Form>

               {/* End of postFormDiv*/}
              </div>

              {/* Div with form for HTTP PUT request - user enters info to update existing "web project" */}
              <div className="putFormDiv">
                <p><b>HTTP PUT:</b> Type in updated values for one of the web projects already in storage</p>

                <Form id="putForm" onSubmit={this.handleSubmitPut}>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter id:</Form.Label>
                    <FormControl type="text" placeholder="id..." name="id" onChange={this.handleChangeIdPut}/>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter title:</Form.Label>
                    <FormControl type="text" placeholder="title..." name="title" onChange={this.handleChangeTitlePut}/>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter description:</Form.Label>
                    <FormControl type="text" placeholder="description..." name="description"
                     onChange={this.handleChangeDescPut}/>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter URL:</Form.Label>
                    <FormControl type="text" placeholder="url..." name="url" onChange={this.handleChangeUrlPut} />
                  </FormGroup>

                  <Button variant="primary" type="submit">Update project</Button>
                </Form>

               {/* End of putFormDiv*/}
              </div>

              {/* Div with form for HTTP Delete request - user enters id of existing "web project" to delete */}
              <div className="deleteFormDiv">
                <p><b>HTTP DELETE:</b> Select a web project entry to delete</p>

                <Form id="deleteForm" onSubmit={this.handleSubmitDelete}>
                  <FormGroup className="mb-3">
                    <Form.Label >Enter id:</Form.Label>
                    <FormControl type="text" placeholder="id..." name="id" onChange={this.handleChangeIdDelete}/>
                  </FormGroup>

                  <Button variant="primary" type="submit">Delete project</Button>
                </Form>

               {/* End of deleteFormDiv*/}
              </div>

             {/* End of input div*/}
            </div>

          {/* div to display list of web projects from from "webProject.json" file on server */}
          <div className="output">
            <h2>Contents of webProjects.json file</h2>
            {this.createOutput()}
          </div>
    </div>
  );

 // End of displayPage function
}

render() {
    return (
      <div>
        {this.displayPage()}
      </div>
    );
  
  // End of render()
  }

}

// Export app so it can be imported by index.js
export default App;
