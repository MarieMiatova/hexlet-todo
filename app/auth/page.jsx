"use client";
import authApi from "@/lib/store/api/authApi";
import { Button, Card, Input, Toast, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function AuthPage() {
  const [step, setStep] = useState(1);
  const [authType, setAuthType] = useState("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onNextStep = useCallback(async () => {
    if (!login.trim()) return;

    if (step === 1) {
      setIsLoading(true);
      const result = await authApi.checkExisting({ login: login.trim() });
      setAuthType(result.success ? "login" : "register");
      setIsLoading(false);
      setStep(2);
      return;
    }

    if (!password) return;

    if (authType === "register" && password !== repeatPassword) {
      toast.danger("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const payload = { login: login.trim(), password };
    const result =
      authType === "login"
        ? await authApi.signIn(payload)
        : await authApi.signUp(payload);
    setIsLoading(false);

    if (!result.success) {
      toast.danger(result.message || "Authentication failed");
      return;
    }

    if (result.token) {
      localStorage.setItem("token", result.token);
    }
    router.push("/");
  }, [authType, login, password, repeatPassword, router, step]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="w-75 p-6 flex flex-col gap-4">
        <h1 className="text-center text-2xl font-medium">Auth</h1>
        <Input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Login"
          size="lg"
          disabled={step !== 1}
        />
        {step > 1 && (
          <>
            <Input
              size="lg"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {authType === "register" && (
              <Input
                size="lg"
                placeholder="Repeat password"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            )}
          </>
        )}
        <Button
          size="lg"
          className={"w-full"}
          onClick={onNextStep}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {step === 1 ? "Next" : authType === "login" ? "Sign in" : "Sign up"}
        </Button>
      </Card>
      <Toast.Provider placement="top-center" />
    </div>
  );
}
