import { useState, type SubmitEventHandler } from "react";
import { Button } from "../components/Button";
import { FormContainer } from "../components/FormContainer";
import { InputBar } from "../components/InputBar";
import { Link } from "react-router-dom";
import { Toast } from "../components/Toast";

export const LoginPage = () => {
    const [status, setStatus] = useState("");
    const onLogin: SubmitEventHandler = (e) => {
        e.preventDefault();
    };

    return (
        <FormContainer onSubmit={onLogin} className="text-text font-display">
            <h2 className="text-accent text-center text-2xl font-bold">Login</h2>
            {status && (
                <Toast
                    toast={{ id: 0, type: "error", message: status }}
                    removeToast={() => setStatus("")}
                />
            )}
            <div>
                <p>Email</p>
                <InputBar type="email" className="w-[100%]" />
            </div>
            <div>
                <p>Password</p>
                <InputBar type="password" className="w-[100%]" />
            </div>
            <Button type="submit" className="mt-3">
                Login
            </Button>
            <span className="">
                Don't have an account?{" "}
                <Link
                    to={{
                        pathname: "/signup",
                    }}
                    className="text-link font-mono"
                >
                    Signup
                </Link>
            </span>
        </FormContainer>
    );
};
