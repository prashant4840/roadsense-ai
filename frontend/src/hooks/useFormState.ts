"use client";

import { useState, useCallback } from "react";
import { AccidentData } from "@/types";

export function useFormState(initialValues: AccidentData) {
  const [formData, setFormData] = useState<AccidentData>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof AccidentData, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof AccidentData, string>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const parsedValue =
        type === "number" || type === "range"
          ? parseFloat(value)
          : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
              ? 1
              : 0
            : value;

      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));

      // Clear error when user starts typing
      if (errors[name as keyof AccidentData]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  return {
    formData,
    setFormData,
    touched,
    errors,
    setErrors,
    handleChange,
    handleBlur,
    resetForm,
  };
}
