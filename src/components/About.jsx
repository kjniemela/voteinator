import React from "react";

const About = () => (
  <>
    <h1 className="unselectable">About</h1>
    <div className="about">
      <h3>Technical Stuff</h3>
      <p>The Voteinator is built entirely in JavaScript, with React.js on the frontend and AWS Lambda on the backend. The item data are stored in an AWS DynamoDB table.</p>
      <h3>About Me</h3>
      <div className="aboutMeContainer">
        <a href="https://www.linkedin.com/in/johannes-niemelae/" target="_blank"><img className="profilePic" src="assets/kjniemela.jpg" alt="Profile Picture"></img></a>
        <p>My name is Johannes Niemelä and I'm a software engineer based in Waco TX. If you're interested in chatting about anything, software-related or otherwise, feel free to reach out on <a href="https://www.linkedin.com/in/johannes-niemelae/" target="_blank">LinkedIn</a>, or send me an email at <a href="mailto:contact@voteinator.com" target="_blank">contact@voteinator.com</a>.</p>
      </div>
      <h3>Credits</h3>
      <small>Thank you to <a href="https://github.com/niemela" target="_blank">Fredrik Niemelä</a> for providing images and metadata for the flags category.<br></br>
      Logo created by <a href="https://www.facebook.com/profile.php?id=100068304399477" target="_blank">Casey Starr</a>.</small>
    </div>
  </>
);

export default About;
