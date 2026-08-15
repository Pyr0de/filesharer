import { useState, type SubmitEventHandler } from "react";
import { Button } from "../components/Button";
import { FormContainer } from "../components/FormContainer";
import { InputBar } from "../components/InputBar";
import { Link } from "react-router-dom";
import { Toast } from "../components/Toast";

export const SignupPage = () => {
    const [status, setStatus] = useState("");
    const onLogin: SubmitEventHandler = (e) => {
        e.preventDefault();
        setStatus("");

        if (e.target.password.value != e.target.confirm.value) {
            setStatus("Passwords do not match");
        }
    };

    return (
        <FormContainer onSubmit={onLogin} className="text-text font-display">
            <h2 className="text-accent text-center text-2xl font-bold">Signup</h2>
            {status && (
                <Toast
                    toast={{ id: 0, type: "error", message: status }}
                    removeToast={() => setStatus("")}
                />
            )}
            <div>
                <p>Email</p>
                <InputBar type="email" className="w-[100%]" name="email" />
            </div>
            <div>
                <p>Password</p>
                <InputBar type="password" className="w-[100%]" name="password" />
            </div>
            <div>
                <p>Confirm Password</p>
                <InputBar type="password" className="w-[100%]" name="confirm" />
            </div>
            <Button type="submit" className="mt-3">
                Create Account
            </Button>
            <span className="">
                Already have an account?{" "}
                <Link
                    to={{
                        pathname: "/login",
                    }}
                    className="text-link font-mono"
                >
                    Login
                </Link>
            </span>
        </FormContainer>
    );
};
