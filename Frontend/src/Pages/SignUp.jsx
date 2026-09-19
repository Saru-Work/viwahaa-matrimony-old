import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { API } from "../utils/api";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    religion: "",
    cast: "",
    occupation: "",
    country_of_resident: "",
  });
  const [religions, setReligions] = useState([]);

  const casts = [
    "Mixed Jaffna Vellalar",
    "Vellalar",
    "Other Vellatar",
    "Viswakulam",
    "Mukkulanthor",
    "Koviyor",
    "Kurukulam",
    "Bhramin",
    "Kounder",
    "Veera Saiva Vellalar",
    "Kujavar",
    "Chettiar",
    "Devar",
    "Kaller",
    "Malayalee",
    "Mukkuwar",
    "Muthaliyar",
    "Naiyudu",
    "Nadar",
    "Pallar",
    "Parawar",
    "Senkunthar",
    "Siviyar",
    "Dadar",
    "Sayakkarar",
    "Nalavar",
    "Agamiliyar",
    "Dobi",
    "Other",
  ];

  const occupations = [
    "Student",
    "Teacher",
    "Engineer",
    "Doctor",
    "Nurse",
    "Programmer",
    "Artist",
    "Scientist",
    "Lawyer",
    "Chef",
    "Entrepreneur",
    "Accountant",
    "Writer",
    "Police Officer",
    "Firefighter",
    "Pilot",
    "Architect",
    "Pharmacist",
    "Salesperson",
    "Athlete",
    "Musician",
    "Journalist",
    "Psychologist",
    "Mechanic",
    "Designer",
    "Veterinarian",
    "Electrician",
    "Other",
  ];

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchReligions = async () => {
      try {
        const response = await fetch(`${API}/api/religions`);
        const data = await response.json();
        if (data.success) {
          setReligions(data.data);
        }
      } catch (error) {
        console.error("Error fetching religions:", error);
      }
    };
    fetchReligions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.religion) newErrors.religion = "Religion is required";
    if (!formData.cast) newErrors.cast = "Caste is required";
    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    if (!formData.country_of_resident)
      newErrors.country_of_resident = "Country of residence is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          religion: formData.religion,
          cast: formData.cast,
          occupation: formData.occupation,
          country_of_resident: formData.country_of_resident,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful! Logging you in...");

      // Auto-Login Logic
      try {
        dispatch(signInStart());
        const signInResponse = await fetch(`${API}/api/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          credentials: "include",
        });

        const signInData = await signInResponse.json();

        if (!signInResponse.ok) {
          throw new Error(signInData.message || "Auto-login failed");
        }

        dispatch(signInSuccess(signInData));
        localStorage.setItem("authToken", signInData.token);

        // Redirect to pricing if a package was selected, otherwise dashboard
        if (location.state?.selectedPackage) {
          navigate("/pricing", {
            state: { autoOpenModalFor: location.state.selectedPackage },
          });
        } else {
          navigate("/customer-profile");
        }
      } catch (loginError) {
        console.error("Auto-login error:", loginError);
        // If auto-login fails, still helpful to redirect to sign-in
        navigate("/sign-in", {
          state: {
            fromSignUp: true,
            selectedPackage: location.state?.selectedPackage,
          },
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* <header className="fh5co-header fh5co-cover fh5co-cover-sm" role="banner" 
        style={{backgroundImage: 'url(front_assets/images/img_bg_1.jpg)', position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}></div>
        <div className="fh5co-container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 text-center">
              <div className="display-t">
                <div className="display-tc animate-box" data-animate-effect="fadeIn">
                  <h1>Register Account</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      <div className="conn">
        {message && (
          <div
            className={`alert ${
              message.includes("success") ? "alert-success" : "alert-danger"
            }`}
            style={{
              padding: "15px",
              backgroundColor: message.includes("success")
                ? "#dff0d8"
                : "#f8d7da",
              color: message.includes("success") ? "#3c763d" : "#721c24",
              borderRadius: "4px",
              marginBottom: "20px",
              border: `1px solid ${
                message.includes("success") ? "#d6e9c6" : "#f5c6cb"
              }`,
            }}
          >
            {message}
          </div>
        )}

        <div className="container1">
          <div className="title">
            <p>Create Your Account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="user_details">
              <div className="input_box">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your firstname"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <span className="text-danger text-sm">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your lastname"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <span className="text-danger text-sm">{errors.lastName}</span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span className="text-danger text-sm">{errors.email}</span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  placeholder="Enter your number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && (
                  <span className="text-danger text-sm">{errors.phone}</span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <span className="text-danger text-sm">{errors.password}</span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <span className="text-danger text-sm">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                {errors.dateOfBirth && (
                  <span className="text-danger text-sm">
                    {errors.dateOfBirth}
                  </span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="religion">Religion</label>
                <select
                  id="religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  required
                  className="dropdown-select"
                >
                  <option value="">Select Religion</option>
                  {religions.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.religion && (
                  <span className="text-danger text-sm">
                    {errors.religion}
                  </span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="cast">Caste</label>
                <select
                  id="cast"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  required
                  className="dropdown-select"
                >
                  <option value="">Select Caste</option>
                  {casts.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.cast && (
                  <span className="text-danger text-sm">{errors.cast}</span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="occupation">Occupation</label>
                <select
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  className="dropdown-select"
                >
                  <option value="">Select Occupation</option>
                  {occupations.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {errors.occupation && (
                  <span className="text-danger text-sm">
                    {errors.occupation}
                  </span>
                )}
              </div>
              <div className="input_box">
                <label htmlFor="country_of_resident">
                  Country of Residence
                </label>
                <input
                  type="text"
                  id="country_of_resident"
                  name="country_of_resident"
                  placeholder="Enter your country of residence"
                  value={formData.country_of_resident}
                  onChange={handleChange}
                  required
                />
                {errors.country_of_resident && (
                  <span className="text-danger text-sm">
                    {errors.country_of_resident}
                  </span>
                )}
              </div>
              <div className="gender">
                <span className="gender_title">Gender</span>
                <input
                  type="radio"
                  name="gender"
                  id="radio_1"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  required
                />
                <input
                  type="radio"
                  name="gender"
                  id="radio_2"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  required
                />

                <div
                  className="category"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "32px",
                    marginTop: 8,
                  }}
                >
                  <label
                    htmlFor="radio_1"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className={`dot ${
                        formData.gender === "male" ? "one active" : "one"
                      }`}
                      style={{ minWidth: 16, minHeight: 16 }}
                    ></span>
                    <span style={{ marginRight: "10px" }}>Male</span>
                  </label>
                  <label
                    htmlFor="radio_2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className={`dot ${
                        formData.gender === "female" ? "two active" : "two"
                      }`}
                      style={{ minWidth: 16, minHeight: 16 }}
                    ></span>
                    <span>Female</span>
                  </label>
                </div>
                {errors.gender && (
                  <span className="text-danger text-sm">{errors.gender}</span>
                )}
              </div>
            </div>

            <div className="reg_btn">
              <button type="submit" className="in" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6 mb-6 text-center">
            <span className="text-gray-700">
              If you already have an account,{" "}
            </span>
            <button
              className="text-[#8D1C21] font-semibold hover:underline ml-1"
              onClick={() => navigate("/sign-in")}
              type="button"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .conn {
          height: 100%;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #FCF8F3;
          flex-direction: column;
          padding: 20px;
        }

        .container1 {
          width: 60%;
          background: #fff;
          border-radius: 2rem;
          box-shadow: 0px 8px 32px rgba(141, 28, 33, 0.1),
            0 1.5px 8px rgba(168, 108, 44, 0.08);
          overflow: hidden;
          margin: 0 auto;
          margin: 10px;
        }

        .container1 .title {
          padding: 25px;
          background: #fff;
        }

        .container1 .title p {
          font-size: 28px;
          font-weight: 700;
          color: #8d1c21;
          position: relative;
        }

        .container1 .title p::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 38px;
          height: 3px;
          background: #fcba03;
        }

        .user_details {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding: 25px;
        }

        .user_details .input_box {
          width: calc(100% / 2 - 20px);
          margin: 0 0 12px 0;
        }

        .input_box label {
          font-weight: 600;
          color: #8d1c21;
          margin-bottom: 5px;
          display: block;
        }

        .input_box label::after {
          content: " *";
          color: #fcba03;
        }

        .input_box input {
          width: 100%;
          height: 45px;
          border: 1.5px solid #800000;
          outline: none;
          border-radius: 7px;
          font-size: 16px;
          padding-left: 15px;
          box-shadow: 0px 0px 0px 1px rgba(141, 28, 33, 0.08);
          
          font-family: "Poppins", sans-serif;
          transition: all 120ms ease-out 0s;
        }

        .input_box select {
          width: 100%;
          height: 45px;
          border: 1.5px solid #800000;
          outline: none;
          border-radius: 7px;
          font-size: 16px;
          padding-left: 15px;
          box-shadow: 0px 0px 0px 1px rgba(141, 28, 33, 0.08);
          font-family: "Poppins", sans-serif;
          background: white;
          cursor: pointer;
        }

        .input_box input:focus,
        .input_box input:valid,
        .input_box select:focus {
          border-color: #8d1c21;
          box-shadow: 0px 0px 0px 2px #fcba03;
        }

        form .gender {
          padding: 0px 25px;
          width: 50%;
        }

        .gender .gender_title {
          font-size: 20px;
          font-weight: 600;
          color: #8d1c21;
        }

        .gender .category {
          width: 80%;
          display: flex;
          margin: 5px 0;
        }

        .gender .category label {
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #a86c2c;
        }

        .gender .category label .dot {
          height: 18px;
          width: 18px;
          background: #fcba03;
          border-radius: 50%;
          margin-right: 10px;
          border: 4px solid #8d1c21;
          transition: all 0.3s ease;
        }

        #radio_1:checked ~ .category label .one,
        #radio_2:checked ~ .category label .two {
          border-color: #fcba03;
          background: #8d1c21;
        }

        .gender input {
          display: none;
        }

        .reg_btn {
          padding: 25px;
          margin: 15px 0;
        }

        .reg_btn .in {
          height: 45px;
          width: 100%;
          border: none;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          background: #8d1c21;
          border-radius: 7px;
          color: #fff;
          letter-spacing: 1px;
          text-shadow: 0px 2px 2px rgba(141, 28, 33, 0.1);
          box-shadow: 0 2px 8px rgba(141, 28, 33, 0.08);
          transition: background 0.2s;
        }

        .reg_btn .in:hover {
          background: #8d1c2b;
        }

        .text-danger {
          color: #c62828;
          font-size: 14px;
          margin-top: 5px;
          display: block;
        }

        .in:disabled {
          background: #e0e0e0;
          color: #a86c2c;
          cursor: not-allowed;
        }

        @media screen and (max-width: 584px) {
          .user_details {
            max-height: 340px;
            overflow-y: scroll;
          }

          .user_details::-webkit-scrollbar {
            width: 0;
          }

          .user_details .input_box {
            width: 100%;
          }

          .gender .category {
            width: 100%;
          }
        }

        @media screen and (max-width: 419px) {
          .container1 {
            width: 90%;
          }

          .gender .category {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
