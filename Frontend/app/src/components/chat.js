/* eslint-disable */
import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

class postView extends React.Component
{
    constructor(props){
        super(props);
        this.state =
        {
          alert:"Welcome to site",
          user: localStorage.getItem('userid'),
          password: localStorage.getItem('password'),
          boxid: localStorage.getItem('boxid'),
          chats: [],
          mycomment: ""
        }
   
    this.handleChange = this.handleChange.bind(this);
    this.addComment = this.addComment.bind(this);
    this.Home = this.Home.bind(this);
  }

  addComment(event) {
    const data = {
      userid: this.state.user,
      boxid: this.state.boxid,
      message: this.state.mycomment
    }

    axios.post("https://ichatb.herokuapp.com/sendbox", data, {
      "Content-Type": "application/json"
    })
      .then(res => {
        this.setState({'chats': res.data.data.chat});
        this.setState({ 'mycomment': "" });
      });

  }

  handleChange(event){
    this.setState({ 'mycomment': event.target.value });
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  getData = () => {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 10000);

    this.setState({ 'user': localStorage.getItem('userid') });
    this.setState({ 'password': localStorage.getItem('password') });
    this.setState({ 'boxid': localStorage.getItem('boxid') });

    const data = {
      boxid: this.state.boxid,
    }

    axios.post("https://ichatb.herokuapp.com/getbox", data, {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          this.setState({ 'chats': [] });
          for (var i of res.data.data.chat) {
            this.state.chats.push({ author: i.author, message: i.message })
          }
          this.setState({ 'chats': this.state.chats });
        }
        else {
          this.setState({ 'alert': "Error in Communication" });
        }
      });

    this.intervalID = setTimeout(this.getData.bind(this), 5000);
  }

  componentDidMount() {
    this.getData();
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
                </ul>
              </div>
            </nav>

            <div className="mg bg">
              <div className="row bgt mr-5 mt-5 pl-5 pt-5 pb-3">
                <h4>{this.state.boxid}</h4>
              </div>
              <div className="col">
                {this.state.chats.map((chat, index) => (
                  <div className="row pb-3">
                        {chat.author == this.state.user && <>
                      <span className="bgt col-10 mt-1 mt-1 text-right"><b>{chat.author}</b></span>
                      <textarea className="col-10 bgt text-white mr-4 m-1 text-right" value={chat.message} disabled ></textarea>
                        </>}
                    {chat.author == this.state.user && <>
                      <span className="bgt col-10  m-1"><b>{chat.author}</b></span>
                      <textarea className="col-10 bgt text-white m-1" value={chat.message} disabled ></textarea>
                    </>}
                  </div>
                ))}
                <div className="row">
                  <textarea class="col-10 text-right col-md-8 bgt text-white ml-4 m-1" placeholder="Type Message Here" value={this.state.mycomment} onChange={this.handleChange}></textarea>
                  <button className="btn btn-dark col-10 col-md-1 ml-4 m-1" onClick={this.addComment} id="Send Message">Send Message</button>
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

export default postView;
