import React from "react";
import {
  UseFormReturn,
  Controller,
  RegisterOptions,
  FieldError,
} from "react-hook-form";
import { FormField as FormFieldType, FormData } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface FormFieldRendererProps {
  field: FormFieldType;
  form: UseFormReturn<FormData>;
}

const getValidationRules = (field: FormFieldType): RegisterOptions => {
  const rules: RegisterOptions = {};
  if (field.required) {
    rules.required = field.validation?.message || `${field.label} is required`;
  }
  if (field.minLength) {
    rules.minLength = {
      value: field.minLength,
      message: `${field.label} must be at least ${field.minLength} characters`,
    };
  }
  if (field.maxLength) {
    rules.maxLength = {
      value: field.maxLength,
      message: `${field.label} must be no more than ${field.maxLength} characters`,
    };
  }
  if (field.type === "email") {
    rules.pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    };
  }
  if (field.type === "tel") {
    rules.pattern = {
      value: /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im,
      message: "Invalid phone number format",
    };
  }

  return rules;
};

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  form,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const fieldError = errors[field.fieldId] as FieldError | undefined;
  const validationRules = getValidationRules(field);

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            data-testid={field.dataTestId}
            {...register(field.fieldId, validationRules)}
            aria-invalid={!!fieldError}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            data-testid={field.dataTestId}
            {...register(field.fieldId, validationRules)}
            aria-invalid={!!fieldError}
          />
        );
      case "dropdown":
        return (
          <Controller
            control={control}
            name={field.fieldId}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <Select
                onValueChange={controllerField.onChange}
                defaultValue={controllerField.value}
                value={controllerField.value}
              >
                <FormControl>
                  <SelectTrigger
                    data-testid={field.dataTestId}
                    aria-invalid={!!fieldError}
                  >
                    <SelectValue
                      placeholder={field.placeholder || `Select ${field.label}`}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      data-testid={option.dataTestId}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
      case "radio":
        return (
          <Controller
            control={control}
            name={field.fieldId}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <RadioGroup
                onValueChange={controllerField.onChange}
                defaultValue={controllerField.value}
                value={controllerField.value}
                className="flex flex-col space-y-1"
                data-testid={field.dataTestId}
                aria-invalid={!!fieldError}
              >
                {field.options?.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={option.value}
                        data-testid={option.dataTestId}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            )}
          />
        );
      case "checkbox":
        return (
          <Controller
            control={control}
            name={field.fieldId}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={controllerField.value}
                    onCheckedChange={controllerField.onChange}
                    data-testid={field.dataTestId}
                    aria-invalid={!!fieldError}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  {field.placeholder && (
                    <FormDescription>{field.placeholder}</FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
        );
      case "date":
        return (
          <Controller
            control={control}
            name={field.fieldId}
            rules={validationRules}
            render={({ field: controllerField }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !controllerField.value && "text-muted-foreground"
                      )}
                      data-testid={field.dataTestId}
                      aria-invalid={!!fieldError}
                    >
                      {controllerField.value ? (
                        format(controllerField.value, "PPP")
                      ) : (
                        <span>{field.placeholder || "Pick a date"}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={controllerField.value}
                    onSelect={controllerField.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        );
      default:
        return (
          <p className="text-red-500">Unsupported field type: {field.type}</p>
        );
    }
  };

  return (
    <FormItem className="mb-4">
      {field.type !== "checkbox" && (
        <FormLabel htmlFor={field.fieldId}>
          {field.label}
          {field.required && "*"}
        </FormLabel>
      )}
      <FormControl>{renderField()}</FormControl>
      <FormMessage>{fieldError?.message}</FormMessage>
    </FormItem>
  );
};

export default FormFieldRenderer;
