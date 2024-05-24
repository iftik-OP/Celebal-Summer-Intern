import React from "react";
import { useLocation } from "react-router-dom";

const UserInfoPage = () => {
  const location = useLocation();
  const formdata = location.state.formdata;

  return (
    <div>
      <h1>User Information</h1>
      <h3>
        Name: {formdata.firstName} {formdata.lastName}
      </h3>
      <h3>Username: {formdata.username} </h3>
      <h4>Email: {formdata.email}</h4>
      <h4>Phone: {formdata.phone}</h4>
      <h4>Country: {formdata.country}</h4>
      <h4>City: {formdata.city}</h4>
      <h4>Pan No.: {formdata.pan}</h4>
      <h4>Addhar No.: {formdata.aadhar}</h4>
    </div>
  );
};

export default UserInfoPage;
