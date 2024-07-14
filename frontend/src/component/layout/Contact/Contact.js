import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:iftikharahmad786.mgs@gmail.com">
        <Button>Contact: iftikharahmad786.mgs@gmail.com"</Button>
      </a>
    </div>
  );
};

export default Contact;
