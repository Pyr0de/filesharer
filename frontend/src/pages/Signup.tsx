import { useState, type SubmitEventHandler } from "react";
import { Button } from "../components/Button";
import { FormContainer } from "../components/FormContainer";
import { InputBar } from "../components/InputBar";
import { Link } from "react-router-dom";
import { Toast } from "../components/Toast";
import { signupAPI } from "../services/api";
import { useAuth } from "../context/auth";

const USERNAME = "username"
const PASSWORD = "password"
const CONFIRM = "confirm"

export const SignupPage = () => {
    const [status, setStatus] = useState("");
    const [errorFields, setErrorFields] = useState<Set<string>>(new Set([]))
    const { login } = useAuth();

    const onLogin: SubmitEventHandler = async (e) => {
        e.preventDefault();
        setStatus("");

        let formData = new FormData(e.target as HTMLFormElement);

        let username = formData.get(USERNAME) as string;
        let password = formData.get(PASSWORD) as string;
        let confirm = formData.get(CONFIRM) as string;

        const error = (key: string) => {
            setErrorFields(prev => {
                const next = new Set(prev)
                next.add(key)
                return next
            })

            setTimeout(() => {
                setErrorFields(prev => {
                    const next = new Set(prev)
                    next.delete(key)
                    return next
                })
            }, 3000)
        }

        if (!username) {
            error(USERNAME)
        }
        if (!password) {
            error(PASSWORD)
        }
        if (!confirm) {
            error(CONFIRM)
        }

        if (!username || !password || !confirm) {
            setStatus("All fields are required")
            return;
        }

        if (password !== confirm) {
            setStatus("Passwords do not match");
            return;
        }
        let user = await signupAPI(username, password);
        login(user);
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
                <InputBar type="text" className={`w-[100%] ${errorFields.has(USERNAME) ? "border-danger" : ""}`} name={USERNAME} />
            </div>
            <div>
                <p>Password</p>
                <InputBar type="password" className={`w-[100%] ${errorFields.has(PASSWORD) ? "border-danger" : ""}`} name={PASSWORD} />
            </div>
            <div>
                <p>Confirm Password</p>
                <InputBar type="password" className={`w-[100%] ${errorFields.has(CONFIRM) ? "border-danger" : ""}`} name={CONFIRM} />
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
