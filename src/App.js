import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [formdata, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    pan: "",
    aadhar: "",
    country: "",
    state: "",
  });
  const initialErrors = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    pan: "",
    aadhar: "",
  };
  const [errors, setErrors] = useState(initialErrors);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };
  const validateForm = () => {
    let newErrors = { ...initialErrors };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formdata.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formdata.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (formdata.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits long";
    }

    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panPattern.test(formdata.pan)) {
      newErrors.pan = "Please enter a valid PAN";
    }

    if (formdata.aadhar.length !== 12) {
      newErrors.aadhar = "Aadhar number must be exactly 12 digits long";
    }

    setErrors(newErrors);

    for (let field in newErrors) {
      if (newErrors[field]) {
        return false;
      }
    }

    return true;
  };
  const filledForm = () => {
    for (let field in formdata) {
      if (!formdata[field]) {
        return false;
      }
    }
    return true;
  };
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Call validateForm whenever formdata changes
  useEffect(() => {
    setIsFormValid(filledForm());
  }, [formdata]);
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormData({
      ...formdata,
      country: selectedCountry.name,
    });
    console.log(selectedCountry.name);
    if (validateForm()) {
      // Perform form submission logic here...

      console.log(selectedCountry.name);
      // Clear the form
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        pan: "",
        aadhar: "",
      });

      navigate("/user", { state: { formdata } });
    }
  };
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();

  useEffect(() => {
    fetch("https://xc-countries-api.fly.dev/api/countries/")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
        // set the first country as selected automatically
        setSelectedCountry(data[0]);
        setFormData({
          ...formdata,
          country: data[0].name,
        });
      });
  }, []);

  useEffect(() => {
    // If there's no selected country, then prevent sending an API request and clear the states
    if (!selectedCountry) {
      setStates([]);
      return;
    }

    fetch(
      `https://xc-countries-api.fly.dev/api/countries/${selectedCountry.code}/states/`
    )
      .then((response) => response.json())
      .then((data) => {
        setStates(data);
        // set the first country as selected automatically
      });
  }, [selectedCountry]);
  return (
    <div className="App">
      <header className="App-header">
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formdata.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formdata.lastName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formdata.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formdata.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formdata.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
          <input
            type="number"
            name="phone"
            placeholder="Phone No."
            value={formdata.phone}
            onChange={handleChange}
          />
          {errors.phone && <p>{errors.phone}</p>}
          <select
            name="countries"
            id="countries"
            style={{
              borderRadius: "5px",
              fontSize: "1.3rem",
            }}
            onChange={(event) =>
              setSelectedCountry(
                countries.find(
                  ({ id }) => id.toString() === event.target.value.toString(),
                  console.log(selectedCountry.name)
                )
              )
            }
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {!!states.length && (
            <div>
              <select
                onChange={
                  (event) =>
                    setFormData({
                      ...formdata,
                      state: event.target.value,
                    })
                  // console.log(event.target.value)
                }
                name="states"
                id="states"
                style={{
                  borderRadius: "5px",
                  fontSize: "1.3rem",
                }}
              >
                {states.map((state) => (
                  <option key={state.id}>{state.name}</option>
                ))}
              </select>
            </div>
          )}
          <input
            type="text"
            name="pan"
            placeholder="Pan no."
            value={formdata.pan}
            onChange={handleChange}
          />
          {errors.pan && <p>{errors.pan}</p>}
          <input
            type="text"
            name="aadhar"
            placeholder="Aadhar No."
            value={formdata.aadhar}
            onChange={handleChange}
          />
          {errors.aadhar && <p>{errors.aadhar}</p>}
          <button
            className="submit"
            type="submit"
            value="Submit"
            // disabled={!isFormValid}
          >
            Submit
          </button>
        </form>
      </header>
    </div>
  );
}

export default SignIn;
