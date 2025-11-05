import axios from "axios";

const isStorybook = typeof window !== "undefined" && !!window.location.href.includes("iframe.html");

export const api = axios.create({
  baseURL: isStorybook ? "" : "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
