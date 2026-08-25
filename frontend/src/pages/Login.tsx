import { useState, type SubmitEventHandler } from "react";
import { Button } from "../components/Button";
import { FormContainer } from "../components/FormContainer";
import { InputBar } from "../components/InputBar";
import { Link } from "react-router-dom";
import { Toast } from "../components/Toast";
import { useAuth } from "../context/auth";
import { loginAPI } from "../services/api";

export const LoginPage = () => {
    const [status, setStatus] = useState("");
    const { login } = useAuth();

    const onLogin: SubmitEventHandler = async (e) => {
        e.preventDefault();
        setStatus("");

        let formData = new FormData(e.target as HTMLFormElement);

        let username = formData.get("username") as string;
        let password = formData.get("password") as string;

        let user = await loginAPI(username, password);
        login(user);
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
                <p>Username</p>
                <InputBar type="text" className="w-[100%]" name="username" />
            </div>
            <div>
                <p>Password</p>
                <InputBar type="password" className="w-[100%]" name="password" />
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
