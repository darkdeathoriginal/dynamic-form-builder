import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormSection as FormSectionType, FormData } from "@/types/form";
import FormFieldRenderer from "./FormFieldRenderer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FormSectionProps {
  section: FormSectionType;
  form: UseFormReturn<FormData>;
}

const FormSection: React.FC<FormSectionProps> = ({ section, form }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        {section.description && (
          <CardDescription>{section.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        {section.fields.map((field) => (
          <FormFieldRenderer key={field.fieldId} field={field} form={form} />
        ))}
      </CardContent>
    </Card>
  );
};

export default FormSection;
