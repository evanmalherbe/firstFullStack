import React from 'react';

// Import logo image
import logo from './animalLogo.png';

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
    //this.getData = this.getData.bind(this);

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

// DELETE: Form input
handleChangeIdDelete(event) {
  this.setState({deleteIdInput: {"id": event.target.value}}, () => console.log("Id is: " + this.state.deleteIdInput))
}

/* HTTP Delete: When user clicks the "Delete Project" button, this function uses HTTP Delete to send the id of the project the user wants to delete to the backend route handler. It then removes the project with the correct id from the webProjects.json file. */
async handleSubmitDelete(event) {
  //console.log("deleteidinput is: " + this.state.deleteIdInput);
  try {
    let url = "/delete-project/";
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
  
      this.setState({
        putFormData: {"id": this.state.putIdInput, 
        "title": this.state.putTitleInput, 
        "desc": this.state.putDescInput, 
        "url": this.state.putUrlInput
      }}, async () => {

      // Callback function for setState. i.e. only do the below once "putFormData" variable has been set
      try {
        
        let url = "/update-project/" + this.state.putIdInput;
        console.log("url is: " + url);

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.putFormData), 
        });
        const response_1 = await response.json(); // parses response to JSON
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

 this.setState({
    postFormData: {
    "id": this.state.idInput, 
    "title": this.state.titleInput, 
    "desc": this.state.descInput, 
    "url": this.state.urlInput
  } }, async () => { 

      // Callback function for setState. i.e. only do the below once "postFormData" variable has been set
      try {
     const response = await fetch("/create-project", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(this.state.postFormData),
     });
     const response_1 = await response.json();
     return alert("Success: ", response_1);
   } catch (error) {
     return console.log("Error: ", error);
   }
  });
}

formatData() {
  // Change data from proxy server into an object
  //console.log("message is: " + this.state.message);
  
  let msg = JSON.parse(this.state.message);
  
  if (msg.length !== 0) {
      // Use map() method to create list items for each object 
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
}

createOutput() {
 
  if (this.state.isLoaded === false) {
    console.log("getdata has started");
    // call fetch function to get "Web Project" data from Express API
    fetch("/show-projects")
    // use json method to convert data to an object
    .then(res => res.json())
    // Deal with result by specifying what to do if successful or not. If success, save data to state array, if not, 
    // create error message
    .then(
          (result) => {
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

// function to display divs and form on page. Looked at this website to remind myself about Bootstrap Forms:
// https://react-bootstrap.netlify.app/components/forms/
displayPage() {
  
  return (
    <div className="app">
        <header className="header">
            <img className="logoImg" src={logo} alt="logo"/>
            <h1>Full Stack With React and Express</h1>
          </header>
         
            <div className="input">
            
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
