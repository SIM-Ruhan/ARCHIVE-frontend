"use client";

import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Logo from "@/components/Logo";
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
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

// 1. Move all the logic into a sub-component
function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const {
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const image = e.target.image.value;
    const role = "user";
    const plan = "free";

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        plan,
      });

      console.log("Signup Result:", result);

      if (result?.error) {
        toast.error(result.error.message || "Registration failed");
        return;
      }

      await authClient.signOut();

      toast.success("Registration successful! Please login.");
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      console.log(result);

      if (result?.error) {
        toast.error(result.error.message || "Google login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
    }
  };

  return (
    <Card className="border border-neutral-200 bg-white mx-auto w-[85%] lg:w-125 py-10 my-15">
      <div className="flex justify-center"><Logo /></div>
      <h1 className="text-center text-2xl font-bold">Create your account</h1>

      <Form
        className="flex lg:w-96 w-[95%] mx-auto flex-col gap-4"
        onSubmit={onSubmit}
      >
        <TextField isRequired name="name" type="text">
          <Label>Name</Label>
          <Input placeholder="Enter your name here" />
          <FieldError />
        </TextField>

        <TextField name="image" type="text">
          <Label>Profile Image URL</Label>
          <Input placeholder="Enter your image URL here" />
          <Description>Add a profile image link</Description>
          <FieldError />
        </TextField>

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
          <Input placeholder="ruhan@gmail.com" />
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
            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <Description>Must be at least 6 characters.</Description>
          <FieldError />
        </TextField>

        <div className="flex justify-between gap-2">
          <Button type="submit" className="px-7 sm:px-11 bg-neutral-900 hover:bg-white hover:text-black hover:border">
            Register
          </Button>

          <Button
            type="reset"
            variant="secondary"
            className="bg-neutral-100 text-black px-7 sm:px-11 hover:bg-neutral-200"
          >
            Reset
          </Button>
        </div>

        <div className="text-center text-gray-500">OR</div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full bg-white"
        >
          <GrGoogle />
          Continue with Google
        </Button>

        <p className="text-center text-sm mt-2">
          Already registered?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold underline">
            Login here
          </Link>
        </p>
      </Form>
    </Card>
  );
}

// 2. Wrap the form in Suspense in the default export
export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading registration...</div>}>
      <SignUpForm />
    </Suspense>
  );
}