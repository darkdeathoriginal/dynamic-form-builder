"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { createUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LoginFormInputs {
  rollNumber: string;
  name: string;
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const result = await createUser(data);

      if (result.success) {
        toast.success("Registration Successful", {
          description:
            result.message || "You have been registered and logged in.",
        });
        login(data);
      } else if (
        !result.success &&
        result.message?.toLowerCase().includes("already exists")
      ) {
        toast.info("Login Successful", {
          description:
            result.message || "Welcome back! You are already registered.",
        });
        login(data);
      } else {
        toast.error("Login Failed", {
          description: result.message || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error during login API call:", error);
      toast.error("Login Failed", {
        description:
          "Could not connect to the server or an unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Student Login / Register
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to access the dynamic form.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                placeholder="e.g., 20CS001"
                {...register("rollNumber", {
                  required: "Roll number is required",
                })}
                aria-invalid={errors.rollNumber ? "true" : "false"}
              />
              {errors.rollNumber && (
                <p className="text-xs text-red-600">
                  {errors.rollNumber.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your Full Name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-5" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoading ? "Processing..." : "Login / Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
