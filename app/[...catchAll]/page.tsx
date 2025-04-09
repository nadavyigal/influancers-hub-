import { notFound } from 'next/navigation'

export default function CatchAllPage() {
  // Trigger the 404 page
  notFound()
}
