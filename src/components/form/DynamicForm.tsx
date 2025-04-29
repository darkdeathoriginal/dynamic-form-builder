"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormStructure, FormData } from "@/types/form";
import FormSection from "./FormSection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface DynamicFormProps {
  formStructure: FormStructure;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formStructure }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const methods = useForm<FormData>({
    mode: "onChange",

    defaultValues: formStructure.sections.reduce((acc, section) => {
      section.fields.forEach((field) => {
        if (field.type === "checkbox") {
          acc[field.fieldId] = false;
        } else if (field.type === "date") {
          acc[field.fieldId] = undefined;
        } else {
          acc[field.fieldId] = "";
        }
      });
      return acc;
    }, {} as FormData),
  });

  const { handleSubmit, trigger, formState } = methods;

  const totalSections = formStructure.sections.length;
  const currentSection = formStructure.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === totalSections - 1;

  const handleNext = async () => {
    setIsLoadingNext(true);

    const currentSectionFieldIds = currentSection.fields.map((f) => f.fieldId);

    const isValid = await trigger(currentSectionFieldIds);

    if (isValid) {
      if (!isLastSection) {
        setCurrentSectionIndex((prev) => prev + 1);
      } else {
        console.log("Attempted next on last section - should submit.");
      }
    } else {
      toast.error("Validation Error", {
        description: `Please fix the errors in the '${currentSection.title}' section before proceeding.`,
      });

      const firstErrorFieldId = currentSectionFieldIds.find(
        (id) => formState.errors[id]
      );
      if (firstErrorFieldId) {
        const element = document.querySelector(
          `[name="${firstErrorFieldId}"]`
        ) as HTMLElement;
        element?.focus();
      }
    }
    setIsLoadingNext(false);
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const onFinalSubmit = (data: FormData) => {
    console.log("Form Submitted Successfully!");
    console.log("Collected Form Data:", data);
    toast.success("Form Submitted!", {
      description: "Check the browser console for the collected data.",
    });
  };

  const progressValue = ((currentSectionIndex + 1) / totalSections) * 100;

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">
          {formStructure.formTitle}
        </h1>
        <p className="text-muted-foreground text-center mb-4">
          Version: {formStructure.version}
        </p>

        <Progress value={progressValue} className="w-full mb-6" />
        <p className="text-center text-sm text-muted-foreground mb-4">
          Section {currentSectionIndex + 1} of {totalSections}:{" "}
          {currentSection.title}
        </p>

        <form onSubmit={handleSubmit(onFinalSubmit)} noValidate>
          <FormSection section={currentSection} form={methods} />

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrev}
              disabled={currentSectionIndex === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {isLastSection ? (
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Submitting..." : "Submit Form"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoadingNext}
              >
                {isLoadingNext ? "Validating..." : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default DynamicForm;
