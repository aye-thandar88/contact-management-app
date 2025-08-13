import React from "react";
import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

type Message = string;

export const showToast = {
  success: (message: Message, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options }),

  error: (message: Message, options?: ToastOptions) =>
    toast.error(message, { ...defaultOptions, ...options }),

  info: (message: Message, options?: ToastOptions) =>
    toast.info(message, { ...defaultOptions, ...options }),

  warning: (message: Message, options?: ToastOptions) =>
    toast.warning(message, { ...defaultOptions, ...options }),
};

export const ToastContainerWrapper: React.FC = () => {
  return <ToastContainer />;
};
