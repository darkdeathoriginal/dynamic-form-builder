"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getForm } from "@/lib/api";
import { FormResponse } from "@/types/form";
import LoginForm from "@/components/auth/LoginForm";
import DynamicForm from "@/components/form/DynamicForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HomePage() {
  const { isLoggedIn, user, logout } = useAuth();
  const [formStructure, setFormStructure] = useState<
    FormResponse["form"] | null
  >(null);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn && user?.rollNumber && !formStructure && !isLoadingForm) {
      const fetchForm = async () => {
        setIsLoadingForm(true);
        setError(null);
        try {
          console.log(`Fetching form for roll number: ${user.rollNumber}`);
          const response = await getForm(user.rollNumber);
          if (response && response.form) {
            console.log("Form structure received:", response.form);
            setFormStructure(response.form);
          } else {
            throw new Error("Received invalid form structure from API.");
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error("Error fetching form:", err);
          setError(err.message || "Failed to load form structure.");
          toast.error("Error Loading Form", {
            description:
              err.message ||
              "Could not fetch the form structure. Please try logging out and back in.",
          });
        } finally {
          setIsLoadingForm(false);
        }
      };
      fetchForm();
    } else if (!isLoggedIn) {
      setFormStructure(null);
      setError(null);
    }
  }, [isLoggedIn, user, formStructure, isLoadingForm]);

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginForm />;
    }

    if (isLoadingForm) {
      return <FormLoadingSkeleton />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <Button onClick={logout} variant="destructive">
            Logout and Try Again
          </Button>
        </div>
      );
    }

    if (formStructure) {
      return (
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-4 px-4">
            <p className="text-sm text-muted-foreground">
              Logged in as: {user?.name} ({user?.rollNumber})
            </p>
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
          <DynamicForm formStructure={formStructure} />
        </div>
      );
    }

    return <p>Something went wrong. Please try logging out and back in.</p>;
  };

  return <main>{renderContent()}</main>;
}

const FormLoadingSkeleton = () => (
  <div className="container mx-auto py-8 px-4">
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/4 mx-auto" />
      <Skeleton className="h-2 w-full mb-6" />
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-px w-full my-4" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-20 w-full mb-4" />
      </div>
      <div className="flex justify-between mt-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  </div>
);
