import { useState, type SubmitEventHandler } from "react";
import { Button } from "../components/Button";
import { FormContainer } from "../components/FormContainer";
import { InputBar } from "../components/InputBar";
import { Link } from "react-router-dom";
import { Toast } from "../components/Toast";
import { signup } from "../services/api";

export const SignupPage = () => {
    const [status, setStatus] = useState("");
    const onLogin: SubmitEventHandler = async (e) => {
        e.preventDefault();
        setStatus("");

        let formData = new FormData(e.target as HTMLFormElement);

        let username = formData.get("username") as string;
        let password = formData.get("password") as string;
        let retype = formData.get("confirm") as string;

        if (password !== retype) {
            setStatus("Passwords do not match");
            return;
        }

        let user = await signup(username, password);
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
                <p>Username</p>
                <InputBar type="text" className="w-[100%]" name="username" />
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
