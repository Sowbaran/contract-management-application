import { createFileRoute } from '@tanstack/react-router'
import { StrictPage } from '../../pages/StrictPage'

export const Route = createFileRoute('/_app/strict-page')({
  component: StrictPage
})
