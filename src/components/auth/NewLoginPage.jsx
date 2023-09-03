import React, { useState } from "react";
import styled from "styled-components";
import * as Components from "./styles/Components";
import { useNavigate, useLocation } from "react-router-dom";
// import { obtainToken, forgotPassword } from "../../services/auth/auth-api";

import Lottie from "lottie-react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import MpiraPhonelottie from "../../assets/lotties/lottiefiles/animation_lley26fl.json";
import WaterLoading from "../../assets/lotties/lottiefiles/WaterLoading.json";
// import ForgotPassword from "./lottiefiles/ForgotPassword.json";
import { toast } from "react-toastify";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OpenEye from "../../assets/lotties/lottiefiles/83983-eye-icon.json";
// import { formatHttpErrorMessage } from "../../utils/helper_functions";

//
function NewLoginPage({ getUserLoggedInUserDataQuery, setUserId, authUserProfile, setAuthUserProfile }) {
    //
    const queryClient = useQueryClient();
    const [signIn, toggle] = React.useState(true);
    let navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    //
    const [passwordType, setPasswordType] = useState("password");
    const [formData, setFormData] = useState();

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password");
    };

    const handleChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loginMutation = useMutation((variables) => {}, {
        onSuccess: (data) => {
            console.log("login data on success : ", data);
            setAuthUserProfile(data?.data?.profile);
            queryClient.invalidateQueries([]);
            // window.location.replace(from, false);
            navigate(from, { replace: true });

            // navigate(from, { replace: true });3333
            // navigate("/dashboard");
            // window.location.reload();
        },
        onError: (error) => {
            // let message = formatHttpErrorMessage(error);
            if (!error.response) {
                toast.error("Could not reach the server! Please check your Internet Connection.");
            } else {
                if (error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message);
                } else {
                    toast.error("An error Occured while Logging You In ! please Contact Administrator");
                }
            }
            setMessage(message);

            console.log("login error : ", error);
        },
    });

    // const forgotPasswordMutation = useMutation(forgotPassword, {
    //   onSuccess: (data) => {
    //     queryClient.invalidateQueries([]);
    //     console.log("data nnnnn is : ", data);
    //     data?.data?.success
    //       ? toast.success(data?.data?.message)
    //       : toast.warning(data?.data?.message);
    //   },
    //   onError: (error) => {
    //     toast.error(
    //       error?.message
    //         ? error?.message
    //         : "An error Occured while processing your Email ! please Contact Administrator"
    //     );
    //   }
    // });

    // const handleForgotPasssword = async (event) => {
    //   event.preventDefault();
    //   if (!email) {
    //     toast.warning("Email is required");
    //   } else {
    //     forgotPasswordMutation.mutate(email);
    //   }
    // };

    const handleSubmit = async (event) => {
        // toggle(false);
        const form = event.currentTarget;
        let invalid = false;
        event.preventDefault();
        navigate("/dashboard");
        // if (form.checkValidity() === false) {
        //     //event.preventDefault();
        //     event.stopPropagation();
        //     invalid = true;
        // }
        // if (!formData?.email || !formData?.password) {
        //     // setMessage("Invalid empty fields");
        //     // setTimeout(() => setMessage(""), 5000);
        //     toast.warning("Both Fields are required");
        // } else {
        //     if (invalid === false) {
        //         console.log("Form Submitted");
        //         // loginMutation.mutate(formData);
        //     }
        // }
    };

    return (
        <section className="app-intro app-sec vh-100 w-100">
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                }}
            >
                <Components.Container>
                    <div>
                        <Components.SignUpContainer signinIn={signIn}>
                            <Components.Form>
                                <h3>
                                    <b>Forgot Password</b>
                                </h3>
                                {/* {forgotPasswordMutation.isLoading && (
                  <div style={{ width: "100%" }}>
                    <Lottie
                      animationData={WaterLoading}
                      loop={true}
                      autoplay={true}
                    />
                  </div>
                )} */}
                                <h5>Enter Email</h5>
                                <Components.Input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Components.Button
                                // onClick={handleForgotPasssword}
                                >
                                    Submit
                                </Components.Button>
                                <h5
                                    onClick={() => toggle(true)}
                                    style={{
                                        cursor: "pointer",
                                        color: "#04619f",
                                        marginTop: "1rem",
                                    }}
                                >
                                    back
                                </h5>
                            </Components.Form>
                        </Components.SignUpContainer>
                    </div>

                    <div style={{ width: "100%" }}>
                        <Components.SignInContainer signinIn={signIn}>
                            <Components.Form>
                                <Components.Title>Login</Components.Title>
                                {loginMutation.isLoading && (
                                    <div style={{ width: "100%" }}>
                                        <Lottie animationData={WaterLoading} loop={true} autoplay={true} />
                                    </div>
                                )}
                                {/* {loginMutation.isError && (
                  <p
                    style={{ dispaly: "block", padding: "10px", color: "red" }}
                  >
                    Invalid Username or Password!
                  </p>
                )} */}
                                {message && <p style={{ dispaly: "block", padding: "10px", color: "red" }}>{message}</p>}
                                <div style={{ width: "100%" }}>
                                    <Components.Input type="text" value={formData?.email} name="email" onChange={handleChange} placeholder="Enter Email" />
                                </div>

                                <PasswordInput>
                                    <input value={formData?.password} placeholder="Password" name="password" type={passwordType} onChange={handleChange} />
                                    <div onClick={togglePassword}>{passwordType === "password" ? <VisibilityOffIcon /> : <Lottie animationData={OpenEye} style={{ width: "25px" }} loop={true} autoplay={true} />}</div>
                                </PasswordInput>

                                <Components.Anchor onClick={() => toggle(false)} href="#">
                                    Forgot your password?
                                </Components.Anchor>
                                <Components.Button onClick={handleSubmit}>Log In</Components.Button>
                            </Components.Form>
                        </Components.SignInContainer>
                    </div>

                    <div style={{ width: "100%" }}>
                        <Components.OverlayContainer signinIn={signIn}>
                            <Components.Overlay signinIn={signIn}>
                                <Components.LeftOverlayPanel signinIn={signIn}>
                                    <h5
                                        style={{
                                            textTransform: "uppercase",
                                            marginBottom: "-0.3rem",
                                        }}
                                    >
                                        BLOODY SAKAI
                                    </h5>

                                    <div style={{ width: "100%" }}>
                                        <Lottie animationData={MpiraPhonelottie} loop={true} autoplay={true} />
                                    </div>
                                </Components.LeftOverlayPanel>

                                <Components.RightOverlayPanel signinIn={signIn}>
                                    <h5
                                        style={{
                                            textTransform: "uppercase",
                                            marginBottom: "-0.3rem",
                                        }}
                                    >
                                        BLOODY SAKAI
                                    </h5>

                                    <div style={{ width: "100%" }}>
                                        <Lottie animationData={MpiraPhonelottie} loop={true} autoplay={true} />
                                    </div>
                                    {/* <Components.GhostButton onClick={() => toggle(false)}>
              Sigin Up
            </Components.GhostButton> */}
                                </Components.RightOverlayPanel>
                            </Components.Overlay>
                        </Components.OverlayContainer>
                    </div>
                </Components.Container>
            </div>
        </section>
    );
}

export default NewLoginPage;

const PasswordInput = styled.div`
    display: flex;
    ${"" /* align-items: center; */}
    justify-content: center;
    flex-direction: row;
    width: 95%;
    input {
        background-color: #eee;
        border: none;
        padding: 12px 15px;

        width: 90%;
        color: black;
    }
    input:focus {
        outline: none;
    }
    div {
        width: 10%;
        background-color: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        cursor: pointer;
    }
`;
