export interface FormFieldOption {
    value: string;
    label: string;
    dataTestId?: string;
  }
  
  export interface FormFieldValidation {
      message: string; 
  }
  
  export interface FormField {
    fieldId: string;
    type: "text" | "tel" | "email" | "textarea" | "date" | "dropdown" | "radio" | "checkbox";
    label: string;
    placeholder?: string;
    required: boolean;
    dataTestId: string;
    validation?: FormFieldValidation; 
    options?: FormFieldOption[];
    maxLength?: number;
    minLength?: number;
  }
  
  export interface FormSection {
    sectionId: number;
    title: string;
    description: string;
    fields: FormField[];
  }
  
  export interface FormStructure {
    formTitle: string;
    formId: string;
    version: string;
    sections: FormSection[];
  }
  
  export interface FormResponse {
    message: string;
    form: FormStructure;
  }
  
  export interface User {
      rollNumber: string;
      name: string;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FormData = Record<string, any>;