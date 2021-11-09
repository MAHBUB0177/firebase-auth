import React from 'react';
import './App.css';


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser]=useState(false);
  const [user, setUser] = useState({
    isLogIn: 'false',
    name: "",
    email: '',
    photo: "",
    error: '',
    success:'',

  })

  var provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        console.log(res)
        const { email, name, picture } = res.additionalUserInfo.profile;
        const signedInUser = {
          isLogIn: 'true',
          name: name,
          email: email,
          photo: picture

        }
        setUser(signedInUser)
        // const {email,name,given_name}=res.profile;
        console.log(res.additionalUserInfo.profile.email)
      })
      .catch(err => {
        console.log(err)

      })
  };

  const handelSignOut = () => {
    console.log('ok')
    firebase.auth().signOut()
      .then(res => {
        const signedOut = {
          isLogIn: 'false',
          name: '',
          email: '',
          password: '',
          photo: " "

        }
        setUser(signedOut)
      })
  }

  const handelcahnge = (event) => {
    // console.log(event.target.value)

    let isFieldValid = true;
    if (event.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

    }
    if (event.target.name === "password") {
      const passValidate = event.target.value.length > 8;
      const isPassVlidate = /\d{1}/.test(event.target.value)
      isFieldValid = passValidate && isPassVlidate;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo)

    }

  }

  const formSubmit = (e) => {
    if ( newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const newUserInfo={...user};
        // newUserInfo.error=''
        newUserInfo.success=true;
        setUser(newUserInfo)
      })
        .catch(error => {
          console.log(error)
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          setUser(newUserInfo)
        })
    }

    if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(res=>{
      const newUserInfo={...user};
      newUserInfo.error="";
      newUserInfo.success='true';
      setUser(newUserInfo)

    })
    .catch(error=>{
      const newUserInfo={...user};
      newUserInfo.error=error.message;
      setUser(newUserInfo)


    })

    }
    e.preventDefault();

  }

  let divStyle={
    backgroundColor:'gray',
    width:'800px',
    textAlign:'center',
    float:'left',
    marginLeft:'250px'
  }

  return (
    <div className="App">
      {
        user.isLogIn ? <button onClick={handelSignOut}>signOut</button> : <button onClick={handleSignIn}>SignIn</button>

      }

      {/* <button onClick={handleSignIn}>SignIn</button> */}

      {
        user.isLogIn && <div>
          <h2>welcome,{user.name}</h2>
          <img src={user.photo} alt="" />
        </div>
      }

     <div style={divStyle}>
      <h1>welcome to authentication page</h1>
      {/* <p>email:{user.email}</p>
      <p>password:{user.password}</p> */}
      <form onSubmit={formSubmit}>
        <div >
          <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)} />
          <label htmlFor="newUser">New User Sign Up</label>
          <br/>
          {newUser && <input type="text" name="username"placeholder="username"/> }
          <br/>
          <input type="email" onBlur={handelcahnge} name="email" placeholder="email" required />
          <br />
          <input type="password" name="password" onBlur={handelcahnge} className="form-control" placeholder="password" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required></input>
          <br />
          <input type="submit" value="submit"></input>
        </div>
      </form>
      <p style={{color:'tomato',fontSize:'20px'}}>{user.error}</p>
      {
        user.success && <p style={{color:'green',fontSize:'20px'}}>user {newUser ? 'created' : 'sign in'} successfully</p>
      }
      </div>
    </div>
  );
}

export default App;
