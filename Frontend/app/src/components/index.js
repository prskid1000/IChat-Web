/* eslint-disable */
import React from "react";
import { Button } from "react-bootstrap";
import '../style/main.css';
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
          <div>
            <nav className="grey darken-4 mb-3">
              <div className="nav-wrapper m-5 ">
                <a href="#" className="left brand-logo hide-on-small-only">IChat-Web</a>
                <a href="#" className="left hide-on-med-and-up">IChat-Web</a>
                <ul className="right">
                  <li><a href="https://wellcart.netlify.app/"><i className="material-icons">store</i></a></li>
                  <li><a href="#"><i className="material-icons" onClick={this.Home}>home</i></a></li>
                  <li><a href="/"><i className="material-icons">logout</i></a></li>
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

            <div className="row">
              <div className="jumbotron col-sm-3 hide-on-med-and-up">
                <div class="jumbotron">
                  <center><h2>Users</h2></center>
                  <center className="pb-5">
                    {this.state.members.map((user, index) => (
                      <div className="card col">
                        <div className="row m-1">
                          <span class="col-8 h5 mt-1 mb-1 ml-1" id={index}>
                            {user.userid}
                          </span>
                          <span class="col-3 new badge teal mt-2 mb-1 darken-4" data-badge-caption="" id={user.userid} onClick={this.newChat} >
                            <a href="#" class="nostyle">
                              New Chat
                          </a>
                          </span>
                        </div>
                      </div>
                    ))}
                  </center>
                </div>
              </div>
              <div className="col-sm-9">
                <div class="jumbotron">
                  <center><h2>My Chats</h2></center>
                  <center>
                    {this.state.chats.map((chat, index) => (
              
                      <div className="row col-11 mt-2 pb-3" id={index}>

                        <div className="card col-sm-12">

                          <span class="new badge teal darken-4 m-3" data-badge-caption="">
                            {chat.boxid}
                          </span>
                          <div className="card-body">
                            {chat.chat.reverse().slice(0,2).map((chat, index) => (
                              <div className="row">
                                {
                                  chat.author != this.state.user &&
                                  <span className="input-group-text text-success col-sm-2 m-1">{chat.author}</span>
                                }
                                {
                                  chat.author == this.state.user &&
                                  <span className="input-group-text red-text col-sm-2 m-1 hide-on-med-and-up">{chat.author}</span>
                                }
                                <textarea class="materialize-textarea col-sm-9 m-1" value={chat.message}  disabled ></textarea>
                                {
                                  chat.author == this.state.user &&
                                  <span className="input-group-text red-text col-sm-2 m-1 hide-on-small-only">{chat.author}</span>
                                }
                              </div>
                            ))}
                            <div className="row">
                              <Button className="btn teal darken-4 col-sm-4 m-1 mr-3" onClick={this.Delete} id={chat.boxid}>Delete Chat</Button>
                              <Button className="btn teal darken-4 col-sm-4 m-1 mr-3" onClick={this.Continue} id={chat.boxid}>Continue Chat</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </center>
                </div>
              </div>
              <div className=" jumbotron col-sm-3 hide-on-small-only">
                <div class="jumbotron">
                  <center><h2>Users</h2></center>
                  <center>
                    {this.state.members.map((user, index) => (
                      <div className="card col">
                        <div className="row mb-1">
                          <span class="col-6 h5 mt-2 mb-1" id={index}>
                            {user.userid}
                          </span>
                          <span class="col-1 new badge teal mt-2 mb-1 darken-4" data-badge-caption="">
                            <a href="#" class="nostyle" id={user.userid} onClick={this.newChat} >
                              New
                          </a>
                          </span>
                        </div>   
                      </div>
                    ))}
                  </center>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default Index;
