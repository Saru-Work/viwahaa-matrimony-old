import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import homeTile from "../assets/images/login viwaha.jpg";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { API } from "../utils/api";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    dispatch(signInStart());

    try {
      const response = await fetch(`${API}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      dispatch(signInSuccess(data));
      localStorage.setItem("authToken", data.token);

      if (location.state?.fromSignUp || location.state?.selectedPackage) {
        navigate("/pricing", {
          state: { autoOpenModalFor: location.state.selectedPackage },
        });
      } else {
        navigate("/customer-profile");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      setErrorMessage(error.message);
    }
  };

  return (
    <div
      className="signin-container"
      style={{
        background: "#FCF8F3",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="session"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "auto",
          maxWidth: "800px",
          height: "auto",
          margin: "0",
          background: "#fff",
          borderRadius: "4px",
          boxShadow: "0px 2px 6px -1px rgba(141, 28, 33, 0.12)",
        }}
      >
        {/* Desktop Image Sidebar */}
        <div
          className="left desktop-image"
          style={{
            width: "300px",
            height: "auto",
            minHeight: "400px",
            position: "relative",
            backgroundImage: `url(${homeTile})`,
            backgroundSize: "cover",
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            borderRight: "4px solid #8D1C21",
          }}
        >
          <svg
            enableBackground="new 0 0 300 302.5"
            version="1.1"
            viewBox="0 0 300 302.5"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: "40px", width: "auto", margin: "20px" }}
          >
            <path
              className="st01"
              d="m126 302.2c-2.3 0.7-5.7 0.2-7.7-1.2l-105-71.6c-2-1.3-3.7-4.4-3.9-6.7l-9.4-126.7c-0.2-2.4 1.1-5.6 2.8-7.2l93.2-86.4c1.7-1.6 5.1-2.6 7.4-2.3l125.6 18.9c2.3 0.4 5.2 2.3 6.4 4.4l63.5 110.1c1.2 2 1.4 5.5 0.6 7.7l-46.4 118.3c-0.9 2.2-3.4 4.6-5.7 5.3l-121.4 37.4zm63.4-102.7c2.3-0.7 4.8-3.1 5.7-5.3l19.9-50.8c0.9-2.2 0.6-5.7-0.6-7.7l-27.3-47.3c-1.2-2-4.1-4-6.4-4.4l-53.9-8c-2.3-0.4-5.7 0.7-7.4 2.3l-40 37.1c-1.7 1.6-3 4.9-2.8 7.2l4.1 54.4c0.2 2.4 1.9 5.4 3.9 6.7l45.1 30.8c2 1.3 5.4 1.9 7.7 1.2l52-16.2z"
              fill="#fff"
            />
          </svg>
        </div>

        {/* Mobile Image Top */}
        <div
          className="mobile-image-top"
          style={{
            display: "none",
            width: "100%",
            height: "200px",
            backgroundImage: `url(${homeTile})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(128, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <svg
              enableBackground="new 0 0 300 302.5"
              version="1.1"
              viewBox="0 0 300 302.5"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                height: "50px",
                width: "auto",
                marginBottom: "15px",
                filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.3))",
              }}
            >
              <path
                className="st01"
                d="m126 302.2c-2.3 0.7-5.7 0.2-7.7-1.2l-105-71.6c-2-1.3-3.7-4.4-3.9-6.7l-9.4-126.7c-0.2-2.4 1.1-5.6 2.8-7.2l93.2-86.4c1.7-1.6 5.1-2.6 7.4-2.3l125.6 18.9c2.3 0.4 5.2 2.3 6.4 4.4l63.5 110.1c1.2 2 1.4 5.5 0.6 7.7l-46.4 118.3c-0.9 2.2-3.4 4.6-5.7 5.3l-121.4 37.4zm63.4-102.7c2.3-0.7 4.8-3.1 5.7-5.3l19.9-50.8c0.9-2.2 0.6-5.7-0.6-7.7l-27.3-47.3c-1.2-2-4.1-4-6.4-4.4l-53.9-8c-2.3-0.4-5.7 0.7-7.4 2.3l-40 37.1c-1.7 1.6-3 4.9-2.8 7.2l4.1 54.4c0.2 2.4 1.9 5.4 3.9 6.7l45.1 30.8c2 1.3 5.4 1.9 7.7 1.2l52-16.2z"
                fill="#fff"
              />
            </svg>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              Viwahaa Matrimony
            </h2>
          </div>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          style={{
            padding: "40px 30px",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingBottom: "20px",
            width: "500px",
            borderRadius: "10px",
            boxShadow: "rgba(141, 28, 33, 0.08) 0px 2px 8px 0px",
          }}
        >
          {/* Mobile Form Header */}
          <div
            className="mobile-form-header"
            style={{
              display: "none",
              width: "100%",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#800000",
                marginBottom: "10px",
              }}
            >
              Login to Your Account
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                margin: 0,
              }}
            >
              Welcome back! Please enter your credentials
            </p>
          </div>

          {/* Desktop Header */}
          <h4
            className="desktop-header"
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "black",
              marginBottom: "20px",
            }}
          >
            We are{" "}
            <span style={{ color: "#800000", fontWeight: 700 }}>
              Viwahaa Matrimony
            </span>
          </h4>
          <p
            className="desktop-subheader"
            style={{
              lineHeight: "155%",
              marginBottom: "5px",
              fontSize: "14px",
              color: "#000",
              opacity: 0.65,
              fontWeight: 400,
              maxWidth: "200px",
              marginBottom: "40px",
            }}
          >
            Welcome back! Log in to your account
          </p>

          <div
            className="floating-label"
            style={{
              position: "relative",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <input
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "calc(100% - 44px)",
                marginLeft: "auto",
                display: "flex",
                fontSize: "16px",
                padding: "20px 0px 20px 16px",
                height: "56px",
                border: "none",
                borderBottom: "solid 1px rgba(0, 0, 0, 0.1)",
                background: "#fff",
                boxSizing: "border-box",
                transition: "all 0.3s linear",
                color: "#000",
                fontWeight: 400,
                WebkitAppearance: "none",
              }}
            />
            <label
              style={{
                position: "absolute",
                top: "calc(50% - 7px)",
                left: 0,
                opacity: 0,
                transition: "all 0.3s ease",
                paddingLeft: "44px",
                fontSize: "12.5px",
                color: "#000",
                opacity: 0.8,
                fontWeight: 400,
              }}
            ></label>
            <div
              className="icon"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "56px",
                width: "44px",
                display: "flex",
              }}
            >
              <svg
                enableBackground="new 0 0 100 100"
                version="1.1"
                viewBox="0 0 100 100"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  height: "30px",
                  width: "30px",
                  margin: "auto",
                  opacity: 0.15,
                  transition: "all 0.3s ease",
                }}
              >
                <g transform="translate(0 -952.36)">
                  <path d="m17.5 977c-1.3 0-2.4 1.1-2.4 2.4v45.9c0 1.3 1.1 2.4 2.4 2.4h64.9c1.3 0 2.4-1.1 2.4-2.4v-45.9c0-1.3-1.1-2.4-2.4-2.4h-64.9zm2.4 4.8h60.2v1.2l-30.1 22-30.1-22v-1.2zm0 7l28.7 21c0.8 0.6 2 0.6 2.8 0l28.7-21v34.1h-60.2v-34.1z" />
                </g>
              </svg>
            </div>
          </div>

          <div
            className="floating-label"
            style={{
              position: "relative",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <input
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "calc(100% - 44px)",
                marginLeft: "auto",
                display: "flex",
                fontSize: "16px",
                padding: "20px 0px 20px 16px",
                height: "56px",
                border: "none",
                borderBottom: "solid 1px rgba(0, 0, 0, 0.1)",
                background: "#fff",
                boxSizing: "border-box",
                transition: "all 0.3s linear",
                color: "#000",
                fontWeight: 400,
                WebkitAppearance: "none",
              }}
            />
            <label
              style={{
                position: "absolute",
                top: "calc(50% - 7px)",
                left: 0,
                opacity: 0,
                transition: "all 0.3s ease",
                paddingLeft: "44px",
                fontSize: "12.5px",
                color: "#000",
                opacity: 0.8,
                fontWeight: 400,
              }}
            ></label>
            <div
              className="icon"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "56px",
                width: "44px",
                display: "flex",
              }}
            >
              <svg
                enableBackground="new 0 0 24 24"
                version="1.1"
                viewBox="0 0 24 24"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  height: "30px",
                  width: "30px",
                  margin: "auto",
                  opacity: 0.15,
                  transition: "all 0.3s ease",
                }}
              >
                <path d="M19,21H5V9h14V21z M6,20h12V10H6V20z" />
                <path d="M16.5,10h-1V7c0-1.9-1.6-3.5-3.5-3.5S8.5,5.1,8.5,7v3h-1V7c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5V10z" />
                <path d="m12 16.5c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.5 1.5-1.5 1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5zm0-2c-0.3 0-0.5 0.2-0.5 0.5s0.2 0.5 0.5 0.5 0.5-0.2 0.5-0.5-0.2-0.5-0.5-0.5z" />
              </svg>
            </div>
          </div>

          {errorMessage && (
            <div
              className="error-message"
              style={{
                color: "red",
                fontSize: "14px",
                marginTop: "5px",
                width: "100%",
              }}
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            style={{
              WebkitAppearance: "none",
              width: "auto",
              minWidth: "100px",
              borderRadius: "24px",
              textAlign: "center",
              padding: "15px 40px",
              marginTop: "5px",
              backgroundColor: "#800000",
              color: "#fff",
              fontSize: "14px",
              marginLeft: "auto",
              fontWeight: 500,
              boxShadow: "0px 2px 6px -1px rgba(141, 28, 33, 0.13)",
              border: "none",
              transition: "all 0.3s ease",
              outline: 0,
              cursor: "pointer",
            }}
          >
            Log in
          </button>
          <a
            href="/sign-up"
            className="discrete"
            style={{
              color: "#8D1C21",
              fontSize: "15px",
              fontWeight: 500,
              marginLeft: "auto",
              marginTop: "40px",
              textDecoration: "none",
              paddingBottom: "2px",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              background: "none",
            }}
          >
            Don't have an account?{" "}
            <span style={{ color: "#800000", fontWeight: 700 }}>Register</span>
          </a>
        </form>
      </div>

      <style>{`
        /* Original desktop styles */
        .signin-container {
          font-family: 'Poppins', sans-serif;
        }
        
        input:focus {
          border-bottom: solid 1px #e6d79d !important;
          outline: 0;
          box-shadow: 0 2px 6px -8px rgba(230, 212, 157, 0.45) !important;
        }
        
        input:not(:placeholder-shown) + label {
          transform: translateY(-10px);
          opacity: 0.7 !important;
        }
        
        .icon svg {
          opacity: 15 !important;
          transition: all 0.3s ease;
          fill: #800000 !important;
        }
        .icon svg path {
          fill: #800000 !important;
        }
        
        input:not(:valid):not(:focus) + label + .icon {
          animation-name: shake-shake;
          animation-duration: 0.3s;
        }
        
        @keyframes shake-shake {
          0% { transform: translateX(-3px); }
          20% { transform: translateX(3px); }
          40% { transform: translateX(-3px); }
          60% { transform: translateX(3px); }
          80% { transform: translateX(-3px); }
          100% { transform: translateX(0px); }
        }
        
        .login-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 2px 6px -1px rgba(219, 225, 138, 0.65) !important;
        }
        
        .login-button:hover:active {
          transform: scale(0.99);
        }
        
        .discrete:hover {
          border-bottom: solid 1px #800000 !important;
        }
        
        /* Tablet Responsive (769px - 1024px) */
        @media (max-width: 1024px) {
          .signin-container {
            padding: 30px 20px;
            align-items: center;
          }
          
          .session {
            flex-direction: column !important;
            max-width: 500px !important;
            width: 100% !important;
            margin: 0 auto !important;
          }
          
          .desktop-image {
            display: none !important;
          }
          
          .mobile-image-top {
            display: block !important;
            height: 180px !important;
          }
          
          .mobile-form-header {
            display: block !important;
          }
          
          .desktop-header,
          .desktop-subheader {
            display: none !important;
          }
          
          .login-form {
            width: 100% !important;
            padding: 30px 25px !important;
            box-shadow: none !important;
            border-radius: 0 0 4px 4px !important;
          }
          
          .floating-label {
            margin-bottom: 15px !important;
          }
          
          input {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 18px 0px 18px 50px !important;
            font-size: 16px !important;
          }
          
          .icon {
            height: 56px !important;
          }
          
          .login-button {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 16px !important;
            font-size: 16px !important;
          }
          
          .discrete {
            width: 100% !important;
            margin-left: 0 !important;
            text-align: center !important;
            margin-top: 25px !important;
          }
        }
        
        /* Mobile Responsive (max-width: 768px) */
        @media (max-width: 768px) {
          .signin-container {
            padding: 20px 15px;
            background: #FCF8F3;
          }
          
          .session {
            flex-direction: column !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            border-radius: 8px !important;
            overflow: hidden;
          }
          
          .desktop-image {
            display: none !important;
          }
          
          .mobile-image-top {
            display: block !important;
            height: 180px !important;
            border-bottom: 4px solid #8D1C21;
          }
          
          .mobile-form-header {
            display: block !important;
          }
          
          .desktop-header,
          .desktop-subheader {
            display: none !important;
          }
          
          .login-form {
            width: 100% !important;
            padding: 25px 20px 30px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          .floating-label {
            margin-bottom: 20px !important;
          }
          
          input {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 18px 0px 18px 50px !important;
            font-size: 16px !important;
            background: #fff !important;
          }
          
          .icon {
            height: 56px !important;
          }
          
          .error-message {
            background-color: #ffebee;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            text-align: center;
          }
          
          .login-button {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 16px !important;
            font-size: 16px !important;
            margin-top: 10px;
          }
          
          .discrete {
            width: 100% !important;
            margin-left: 0 !important;
            text-align: center !important;
            margin-top: 25px !important;
            font-size: 15px !important;
          }
        }
        
        /* Small Mobile (max-width: 480px) */
        @media (max-width: 480px) {
          .signin-container {
            padding: 15px 12px;
          }
          
          .mobile-image-top {
            height: 150px !important;
          }
          
          .mobile-image-top h2 {
            font-size: 20px !important;
          }
          
          .mobile-image-top svg {
            height: 40px !important;
            margin-bottom: 10px !important;
          }
          
          .mobile-form-header h3 {
            font-size: 18px !important;
          }
          
          .mobile-form-header p {
            font-size: 13px !important;
          }
          
          .login-form {
            padding: 20px 15px 25px !important;
          }
          
          input {
            font-size: 15px !important;
            padding: 16px 0px 16px 45px !important;
            height: 52px !important;
          }
          
          .icon {
            height: 52px !important;
          }
          
          .login-button {
            padding: 14px !important;
            font-size: 15px !important;
          }
          
          .discrete {
            font-size: 14px !important;
          }
        }
        
        /* Desktop (min-width: 1025px) */
        @media (min-width: 1025px) {
          .mobile-image-top {
            display: none !important;
          }
          
          .mobile-form-header {
            display: none !important;
          }
          
          .desktop-image {
            display: block !important;
          }
          
          .desktop-header,
          .desktop-subheader {
            display: block !important;
          }
          
          .session {
            flex-direction: row !important;
          }
          
          .login-form {
            width: 500px !important;
          }
          
          input {
            width: calc(100% - 44px) !important;
            margin-left: auto !important;
            padding: 20px 0px 20px 16px !important;
          }
          
          .login-button {
            width: auto !important;
            margin-left: auto !important;
          }
          
          .discrete {
            width: auto !important;
            margin-left: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
