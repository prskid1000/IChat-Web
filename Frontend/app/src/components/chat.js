/* eslint-disable */
import React from "react";
import { Button } from "react-bootstrap";
import '../style/main.css';
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
    console.log("hi");
  }

  componentDidMount() {
    this.getData();
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
 
            <div>
              <center><h2>Chat</h2></center>
              <div className="row mt-md-2 pb-3">
                <div className="card col-sm-12">
                  <span class="new badge teal darken-4 m-3" data-badge-caption="">
                    {this.state.boxid}
                  </span>
                  <div className="card-body bgt">
                    {this.state.chats.map((chat, index) => (
                      <div className="row">
                        {
                          chat.author != this.state.user &&
                          <span className="input-group-text text-success col-sm-2 m-1">{chat.author}</span>
                        }
                        {
                          chat.author == this.state.user &&
                          <span className="input-group-text red-text col-sm-2 m-1 hide-on-med-and-up">{chat.author}</span>
                        }
                        <textarea class="materialize-textarea col m-1" value={chat.message} disabled ></textarea>
                        {
                          chat.author == this.state.user &&
                          <span className="input-group-text red-text col-sm-2 m-1 hide-on-small-only">{chat.author}</span>
                        }
                      </div>
                    ))}
                    <div className="row">
                      <textarea class="materialize-textarea col-sm-8 m-1" value={this.state.mycomment} onChange={this.handleChange}></textarea>
                      <Button className="btn teal darken-4 col-sm-2 m-1" onClick={this.addComment} id="Send Message">Send Message</Button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        );
    }
}

export default postView;
