/**
 * I am a dynamic page with $page as variable in the route
 */
import { createFileRoute } from '@tanstack/react-router'
import { DynamicPage } from '../../pages/DynamicPage'

export const Route = createFileRoute('/_app/$page')({
  component: DynamicPage
})
