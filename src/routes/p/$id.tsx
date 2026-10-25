import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/claro-public";

export const Route = createFileRoute("/p/$id")({
  component: PublicRoute,
});

function PublicRoute() {
  const { id } = Route.useParams();
  return <PublicPage id={id} />;
}
