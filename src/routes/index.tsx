import { createFileRoute } from "@tanstack/react-router";
import { ClaroApp } from "@/components/claro-app";

export const Route = createFileRoute("/")({ component: ClaroApp });
