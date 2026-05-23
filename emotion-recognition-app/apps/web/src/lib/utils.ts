import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SupportedLanguage } from "@emotion-recognition/shared";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatTime(value?: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Có lỗi xảy ra. Vui lòng thử lại.";
}

export function formatLanguageName(language: SupportedLanguage) {
  return language === "en" ? "English" : "Vietnamese";
}
