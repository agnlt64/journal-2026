import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello /projets!</div>
}
