/* eslint-disable */
import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

function remove(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

class Index extends React.Component
{
    constructor(props){
        super(props);
        this.state =
        {
          alert:"Welcome to site",
          user: localStorage.getItem('userid'),
          password: localStorage.getItem('password'),
          boxids: [],
          chats: [],
          members: [],
          time: ""
        }

      this.Continue = this.Continue.bind(this);
      this.Delete = this.Delete.bind(this);
      this.newChat = this.newChat.bind(this);
      this.Home = this.Home.bind(this);
    }

  newChat(event){

    var boxid = "#" + this.state.user + "-" + event.target.id;
    console.log(boxid);

    const data = {
      userid: this.state.user,
      boxid: boxid,
      message: "Hi, " + event.target.id
    }

    axios.post("https://ichatb.herokuapp.com/sendbox", data, {
      "Content-Type": "application/json"
    })
      .then(res => {

        if (res.data.success === "True") {
          const data1 = {
            userid: this.state.user,
            boxid: boxid,
          }

          axios.post("https://ichatb.herokuapp.com/setbox", data1, {
            "Content-Type": "application/json"
          })
            .then(res => {

              if (res.data.success === "True") {
                const data2 = {
                  userid: event.target.id,
                  boxid: boxid,
                }

                axios.post("https://ichatb.herokuapp.com/setbox", data2, {
                  "Content-Type": "application/json"
                })
                  .then(res => {

                    if (res.data.success === "True") {
                      localStorage.setItem('boxid', boxid);
                      this.props.history.push("/chat");
                    }
                    else {
                      this.setState({ 'alert': "Error in Communication1" });
                    }
                  });
              }
              else {
                this.setState({ 'alert': "Error in Communication2" });
              }
            });
        }
        else {
          this.setState({ 'alert': "Error in Communication3" });
        }
      });
  }

  Continue(event) {
    localStorage.setItem('boxid', event.target.id);
    this.props.history.push("/chat");
  }

  Delete(event) {
    const data = {
      boxid: event.target.id,
    }


    axios.post("https://ichatb.herokuapp.com/deletebox", data, {
      "Content-Type": "application/json"
    });

    const data1 = {
      userid: event.target.id.substring(1, event.target.id.indexOf('-')),
      boxid: event.target.id
    }
    axios.post("https://ichatb.herokuapp.com/unsetbox", data1, {
      "Content-Type": "application/json"
    });

    const data2 = {
      userid: event.target.id.substring(event.target.id.indexOf('-') + 1),
      boxid: event.target.id
    }
    axios.post("https://ichatb.herokuapp.com/unsetbox", data2, {
      "Content-Type": "application/json"
    });

    var local = new Array();
    for (var i in this.state.chats) {
      if (this.state.chats[i].boxid != event.target.id)
        local.push(this.state.chats[i]);
    }

    remove(this.state.boxids, event.target.id);
    this.setState({ 'boxids': this.state.boxids, 'chats': local });
  }
  
  componentWillUnmount(){
    clearTimeout(this.intervalID);
  }

  getData = () => {
    this.setState({ 'user': localStorage.getItem('userid') });
    this.setState({ 'password': localStorage.getItem('password') });

    const data = {
      userid: this.state.user,
      password: this.state.password
    }
    axios.post("https://ichatb.herokuapp.com/isauth", data, {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          var c = []
          console.log(c);
          for (var i in res.data.data.boxid) {
            this.state.boxids.push(res.data.data.boxid[i]);
            this.setState({ 'boxids': res.data.data.boxid });
            axios.post("https://ichatb.herokuapp.com/getbox",
              { boxid: this.state.boxids[i] }, {
              "Content-Type": "application/json"
            })
              .then(res => {
                if (res.data.success === "True") {
                  c.push({
                    boxid: res.data.data.boxid,
                    chat: res.data.data.chat
                  })
                  this.setState({ 'chats': c });
                }
              });
          }
        }
        else {
          this.setState({ 'alert': "Error in Communication" });
        }
      });

    axios.get("https://ichatb.herokuapp.com/getusers", {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          this.setState({ 'members': [] });
          for (var i in res.data.data) {
            if (this.state.user != res.data.data[i].userid) {
              this.state.members.push({
                userid: res.data.data[i].userid,
              });
            }
          }
          this.setState({ 'members': this.state.members });
        }
        else {
          this.setState({ 'alert': "Error in Communication" });
        }
      });
      this.intervalID = setTimeout(this.getData.bind(this), 10000);
  }

  componentDidMount() {
    this.getData()
  }

  Home(event) {
    this.props.history.push("/index");
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
                  <li className="nav-item pl-3">
                    <a className="btn navbar-dark text-white clickable" href="/"><i className="fas fa-sign-out-alt f24"></i><br></br>Logout</a>
                  </li>
                </ul>
              </div>
            </nav>
            
            <div className="mt-5 p-4 bg">
              <ul className="nav nav-pills ml-3">
                <li className="nav-item"><a className="nav-link active btn btn-dark bgt" data-toggle="pill" href="#message" role="tab">My Messages</a></li>
                <li className="nav-item"><a className="nav-link btn btn-dark bgt" data-toggle="pill" href="#contact" role="tab">My Contact</a></li>
              </ul>

              <div className="tab-content">

                <div id="message" className="tab-pane active" role="tabpanel">
                  <div className="mg">
                    <div className="row bgt p-4">
                      {this.state.chats.map((chat, index) => (
                        <div className="card col-12 col-md-3 m-1">

                          <span className="h5 bgt mt-3">{chat.boxid}</span>
                          <div className="card-body">
                            {chat.chat.reverse().slice(0, 1).map((chat, index) => (
                              <div className="row pb-3">
                                <span className="text-white bgt h5 col-10 col-md-6 m-1"><b>{chat.author}</b></span>
                                <textarea className="col-10 bgt text-white ml-4 m-1" value={chat.message} disabled ></textarea>
                              </div>

                            ))}
                            <div className="row">
                              <button className="btn btn-dark bgt col-5 m-1 mr-3" onClick={this.Delete} id={chat.boxid}>Delete</button>
                              <button className="btn btn-dark bgt col-5 m-1 mr-3" onClick={this.Continue} id={chat.boxid}>Continue</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div id="contact" className="tab-pane fade" role="tabpanel">
                  <div className="mg">
                    <div className="row p-4">
                      {this.state.members.map((user, index) => (
                        <div className="card col-12 col-md-3 m-2">
                          <div className="text-white h5 mt-2 mb-2" id={index}>
                            <b>{user.userid}</b>
                            <span>
                              <a className="float-right btn btn-dark bgt" id={user.userid} onClick={this.newChat}>Chat</a>
                            </span>
                          </div>
                        </div>
                      ))}
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

export default Index;
