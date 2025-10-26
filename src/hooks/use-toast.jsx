// src/hooks/use-toast.jsx
"use client";

import * as React from "react";
import { create } from "zustand";

// Zustand store to hold all toasts
const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { id: Date.now(), ...toast }] })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function useToast() {
  const { toasts, addToast, removeToast } = useToastStore();

  // helper function to show a toast
  function toast(toastData) {
    const id = toastData.id ?? Date.now();
    addToast({ ...toastData, id });
    setTimeout(() => removeToast(id), 4000); // auto remove after 4 seconds
  }

  return { toasts, toast, removeToast };
}
