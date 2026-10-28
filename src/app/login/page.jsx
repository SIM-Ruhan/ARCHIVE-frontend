"use client";

import { Suspense } from "react";
import { authClient } from "@/lib/auth-client"; 
import { GrGoogle } from "react-icons/gr";
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

function LogInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const onSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error("Log in failed");
      return;
    }
    toast.success("Logged in");
    router.push(redirectTo);
  };

  const handleGoogleLogin = async () => {
    try {
      // This initiates the OAuth flow and redirects the user to Google.
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo, // Uses the redirect URL you already set up
      });

      if (error) {
        toast.error(error.message || "Google login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  //end here
  return (
    <Card className="border border-neutral-200 bg-white mx-auto w-[85%] lg:w-125 py-10 my-10">
      <div className="flex justify-center"><Logo /></div>
      <h1 className="text-center text-2xl font-bold">Log in</h1>

      <Form
        className="flex lg:w-96 w-[95%] mx-auto flex-col gap-4"
        onSubmit={onSubmit}
      >

        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
            ) {
              return "Please enter a valid email address";
            }
            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="john@example.com" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          minLength={6}
          name="password"
          type="password"
          validate={(value) => {
            if (value.length < 6) {
              return "Password must be at least 6 characters";
            }
            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter";
            }
            if (!/[a-z]/.test(value)) {
              return "Password must contain at least one lowercase letter";
            }
            if (!/[0-9]/.test(value)) {
              return "Password must contain at least one number";
            }
            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <Description>Must be at least 6 characters.</Description>
          <FieldError />
        </TextField>

        <div className="flex justify-between gap-2">
          <Button type="submit" className="bg-neutral-900 px-10 sm:px-15 hover:bg-white hover:text-black hover:border">
            Login
          </Button>
          <Button type="reset" variant="secondary" className="bg-neutral-100 text-black px-10 sm:px-15 hover:bg-neutral-200">
            Reset
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">OR</div>

        <Button type="button" onClick={handleGoogleLogin} variant="outline" className="w-full bg-white">
          <GrGoogle/> Continue with Google
        </Button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link href={`/registration?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold underline">
            Register here
          </Link>
        </p>
      </Form>
    </Card>
  );
}

export default function LogInPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <LogInForm />
    </Suspense>
  );
}