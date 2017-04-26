import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor () {
    super(); 
    this.state = {
      user: null,
      pictures: []
    };
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
    
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();  

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }
  handleAuthFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();  

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error: ${error.code}: ${error.message}`));
  }
  handleLogout () {
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha salido`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }
  handleUpload (event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);
    task.on('state_changed', snapshot => {
      let percentege = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentege
      })      
    }, error => {
      console.log(error.message)
    }, () => {
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL
        };
        const dbRef = firebase.database().ref('pictures');
        const newPicture = dbRef.push();
        newPicture.set(record);
    });
  }
  renderLoginButton(){
    //Si el usuario esta logueado
    if(this.state.user){
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p> Hola {this.state.user.displayName}! </p>
          <button onClick={this.handleLogout}> Salir </button>
          <FileUpload onUpload={ this.handleUpload }/>
          {
            this.state.pictures.map(picture => (
              <div>
                <img src={picture.image} alt='' width="300"/>
                <br/>
                <img src={picture.photoURL} alt={picture.displayName} width="48"/>
                <br/>
                <span> {picture.displayName} </span>
              </div>
              )).reverse()
          }
        </div>
        );
    }else {
      //Si el usuario no esta logueado 
      return(
      <div>
        <div className="contenedor">
          <button onClick={this.handleAuth} className="waves-effect waves-light btn indigo"> Login con <i className="fa fa-google fa-2x"></i>oogle  </button>
        </div>
        <div className="contenedor">      
          <button onClick={this.handleAuthFacebook} className="waves-effect waves-light btn indigo"> Login con <i className="fa fa-facebook-official fa-2x"></i>acebook  </button>              
        </div>
      </div>
        );
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header indigo">
          <h2>BugGram</h2>
        </div>
        <p className="App-intro">
          {this.renderLoginButton() }          
        </p>
      </div>
    );
  }
}

export default App;
