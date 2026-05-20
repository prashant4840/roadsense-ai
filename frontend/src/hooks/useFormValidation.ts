"use client";

import { AccidentData } from "@/types";

export function useFormValidation() {
  const validateForm = (data: AccidentData): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Hour validation
    if (data.hour < 0 || data.hour > 23) {
      errors.hour = "Hour must be between 0 and 23";
    }

    // Temperature validation
    if (data.temperature < -50 || data.temperature > 60) {
      errors.temperature = "Temperature must be between -50 and 60°C";
    }

    // Vehicles validation
    if (data.vehicles_involved < 1) {
      errors.vehicles_involved = "At least 1 vehicle must be involved";
    }

    // Casualties validation
    if (data.casualties < 0) {
      errors.casualties = "Casualties cannot be negative";
    }

    // Binary fields validation
    if (data.is_weekend !== 0 && data.is_weekend !== 1) {
      errors.is_weekend = "Invalid weekend value";
    }
    if (data.is_peak_hour !== 0 && data.is_peak_hour !== 1) {
      errors.is_peak_hour = "Invalid peak hour value";
    }
    if (data.is_night !== 0 && data.is_night !== 1) {
      errors.is_night = "Invalid night value";
    }

    return errors;
  };

  return { validateForm };
}
