/* eslint-disable */
import React from "react";
import { Button } from "react-bootstrap";
import '../style/main.css';
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
          <div>
            <nav className="grey darken-4 mb-3">
              <div className="nav-wrapper m-5 ">
                <a href="#" className="left brand-logo hide-on-small-only">IChat-Web</a>
                <a href="#" className="left hide-on-med-and-up">IChat-Web</a>
                <ul className="right">
                  <li><a href="https://wellcart.netlify.app/"><i className="material-icons">store</i></a></li>
                  <li><a href="/"><i className="material-icons">home</i></a></li>
                </ul>
              </div>
            </nav>

            <div className="alert white-text grey darken-1 alert-dismissible fade show" role="alert">
              <strong>{this.state.alert}</strong>
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <br></br>

            <ul className="nav nav-pills col-12 col-md-6 bg-dark ml-md-5 mt-md-5">
              <li className="nav-item"><a className="nav-link active btn  btn-dark bg-dark" data-toggle="pill" href="#login" role="tab">Login</a></li>
              <li className="nav-item"><a className="nav-link btn btn-dark bg-dark" data-toggle="pill" href="#register" role="tab">Register</a></li>
            </ul>
            <div className="tab-content">
              <div id="login" className="tab-pane active" role="tabpanel">
                <div className="col-sm-6">
                  <div class="jumbotron">
                    <div class="card">
                      <div class="card-body">
                        <form>
                          <div class="input-group form-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text"><i class="fas fa-user"></i></span>
                            </div>
                            <input type="text" class="form-control" placeholder="userid" id="userid" name="userid" onChange={this.handleChange}></input>
                          </div>
                          <div class="input-group form-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text"><i class="fas fa-key"></i></span>
                            </div>
                            <input type="password" class="form-control" placeholder="password" id="password" name="password" onChange={this.handleChange}></input>
                          </div>
                          <div class="row">
                            <input type="button" value="Sign In" class="col btn float-right login_btn grey darken-4 white-text" onClick={this.Login} id="Login"></input>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="register" className="tab-pane" role="tabpanel">
                <div className="col-sm-6">
                  <div class="jumbotron">
                    <div class="card">
                      <div class="card-body">
                        <form>
                          <div class="input-group form-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text"><i class="fas fa-user"></i></span>
                            </div>
                            <input type="text" class="form-control" placeholder="userid" id="userid" name="userid" onChange={this.handleChange}></input>
                          </div>
                          <div class="input-group form-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text"><i class="fas fa-key"></i></span>
                            </div>
                            <input type="password" class="form-control" placeholder="password" id="password" name="password" onChange={this.handleChange}></input>
                          </div>
                          <div class="input-group form-group">
                            <div class="input-group-prepend">
                              <span class="input-group-text"><i class="fas fa-key"></i></span>
                            </div>
                            <input type="password" class="form-control" name="password" id="password" placeholder="Re-Enter Password" onChange={this.checkPassword}></input>
                          </div>
                          <div class="row">
                            <input type="button" value="Sign Up" class="col btn float-right login_btn grey darken-4 white-text" onClick={this.Register} id="Register"></input>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default Accounts;
