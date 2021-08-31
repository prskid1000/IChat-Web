/* eslint-disable */
import React from "react";
import axios from "axios";

class Accounts extends React.Component
{
    constructor(props){
        super(props);
        this.state =
        {
          alert:"Welcome to site",
          userid:"",
          password:""
        }
      this.handleChange = this.handleChange.bind(this);
      this.Login = this.Login.bind(this);
      this.Register = this.Register.bind(this);
      this.checkPassword = this.checkPassword.bind(this);
      this.Home = this.Home.bind(this);
    }

  Home(event) {
    this.props.history.push("/");
  }

  handleChange(event){
    
    switch (event.target.id)
    {
      case "userid":
        this.setState({'userid': event.target.value});
        break;
      case "password":
        this.setState({'password': event.target.value });
        break;
    }
  }

  checkPassword(event)
  {
    if (event.target.value != this.state.password)
    {
      this.setState({ 'alert': "Password Mismatch" });
    }
    else
    {
      this.setState({ 'alert': "Password Matched" });
    }
  }

  Login(event) {
  
  const data = {
      userid: this.state.userid,
      password: this.state.password
    }

    console.log(data);
    axios.post("https://ichatb.herokuapp.com/isauth",  data , {
      "Content-Type": "application/json" })
    .then(res => {
      console.log(res.data.success);
      if(res.data.success === "True")
      {
        localStorage.setItem('userid', this.state.userid);
        localStorage.setItem('password', this.state.password); 
        this.props.history.push("/index");
      }
      else
      {
        this.setState({ 'alert': "Error in Communication" });
      }
    });
  }

  Register(event) {
    const data = {
      userid: this.state.userid,
      password: this.state.password
    }
    axios.post("https://ichatb.herokuapp.com/adduser", data, {
      "Content-Type": "application/json"
    })
      .then(res => {
        console.log(res.data.success);
        if (res.data.success === "True") {
          localStorage.setItem('userid', this.state.userid);
          localStorage.setItem('password', this.state.password); 
          this.props.history.push("/index");
        }
        else {
          this.setState({ 'alert': "Error in Communication" });
        }
      });
  }

    render() {
        return (
          <>  
          <nav className="navbar fixed-top navbar-expand-md bg">
            <div className="title">IChat</div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
              <i className="text-white fas fa-bars"></i>
            </button>

            <div className="collapse navbar-collapse subbg2" id="collapsibleNavbar">
              <ul className="nav navbar-nav ml-auto navbar-right">
                  <li className="nav-item pl-3">
                    <button className="btn navbar-dark clickable f24 text-white" onClick={this.Home}>Home</button>
                  </li>
              </ul>
             </div>
          </nav>
          <div className="mt-5 p-4 bg">
              <ul className="nav nav-pills ml-3">
                <li className="nav-item"><a className="nav-link active btn btn-dark bgt" data-toggle="pill" href="#login" role="tab">Login</a></li>
                <li className="nav-item"><a className="nav-link btn btn-dark bgt" data-toggle="pill" href="#signup" role="tab">Sign Up</a></li>
              </ul>

              <div className="tab-content">

                <div id="login" className="tab-pane active" role="tabpanel">
                  <div className="row p-4">
                    <div className="col-12 col-md-3">
                      <label>UserId</label>
                      <input type="text" className="form-control" id="userid" name="userid" onChange={this.handleChange}></input><br></br>
                      <label>Password</label>
                      <input type="password" className="form-control" id="password" name="password" onChange={this.handleChange}></input><br></br>
                      <button className="btn float-right col-6 btn-dark mt-2" onClick={this.Login} id="Login">Login</button>
                    </div>
                  </div>
                </div>
                <div id="signup" className="tab-pane fade" role="tabpanel">
                  <div className="row p-4">
                    <div className="col-12 col-md-3">
                      <label>UserId</label>
                      <input type="text" class="form-control" id="userid" name="userid" onChange={this.handleChange}></input><br></br>
                      <label>Password</label>
                      <input type="password" class="form-control" id="password" name="password" onChange={this.handleChange}></input><br></br>
                      <label>Re-Type Password</label>
                      <input type="password" class="form-control" name="password" id="password" onChange={this.checkPassword}></input><br></br>
                      <button className="btn float-right col-6 btn-dark mt-2"  onClick={this.Register} id="Register">Sign Up</button>
                    </div>
                  </div>
                </div>
               </div>
          </div>
          
          <div className="panel-group fixed-bottom bg row pl-md-5 p-3">
              <div className="panel col-8">
                <div className="panel-body">
                  <div className="ftext">Contact Us</div>
                  <div className="ftext">Email: prskid1000@gmail.com</div>
                  <div className="ftext">Address: IIIT-R, Jharkhand, India</div>
                </div>
              </div>
              <div className="panel col-4 p-3">
                <div className="panel-body">
                  <div className="ftext clickable"><a className="clickable text-white" href="https://wellcart.netlify.app/" >Donate Us</a></div>
                </div>
              </div>
              <div className="panel col-12">
                <div className="d-flex ftext justify-content-center panel-body">
                  Copyright @ 2021, IChat
                </div>
              </div>
            </div>
          </>
        );
    }
}

export default Accounts;
