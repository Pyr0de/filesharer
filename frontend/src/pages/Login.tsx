import { useState, type SubmitEventHandler } from "react";
import { Button } from "../components/Button";
import { FormContainer } from "../components/FormContainer";
import { InputBar } from "../components/InputBar";
import { Link } from "react-router-dom";
import { Toast } from "../components/Toast";
import { useAuth } from "../context/auth";
import { loginAPI } from "../services/api";

const USERNAME = "username";
const PASSWORD = "password";

export const LoginPage = () => {
    const [status, setStatus] = useState("");
    const [errorFields, setErrorFields] = useState<Set<string>>(new Set([]));
    const { login } = useAuth();

    const onLogin: SubmitEventHandler = async (e) => {
        e.preventDefault();
        setStatus("");

        let formData = new FormData(e.target as HTMLFormElement);

        let username = formData.get(USERNAME);
        let password = formData.get(PASSWORD);

        const error = (key: string) => {
            setErrorFields((prev) => {
                const next = new Set(prev);
                next.add(key);
                return next;
            });

            setTimeout(() => {
                setErrorFields((prev) => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }, 3000);
        };
        if (!username) {
            error(USERNAME);
        }
        if (!password) {
            error(PASSWORD);
        }

        if (!username || !password) {
            setStatus("All fields are required");
            return;
        }

        let response = await loginAPI(username as string, password as string);
        if ("code" in response) {
            setStatus(response.message);
            return;
        }
        login(response);
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
                <InputBar
                    type="text"
                    className={`w-[100%] ${errorFields.has(USERNAME) ? "border-danger" : ""}`}
                    name={USERNAME}
                />
            </div>
            <div>
                <p>Password</p>
                <InputBar
                    type="password"
                    className={`w-[100%] ${errorFields.has(PASSWORD) ? "border-danger" : ""}`}
                    name={PASSWORD}
                />
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
