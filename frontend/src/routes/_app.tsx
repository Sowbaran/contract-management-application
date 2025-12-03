import { Outlet, createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '../layouts/page'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createFileRoute('/_app')({
  component: AppLayout
})

function AppLayout() {
  return (
    <PageLayout>
      <>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </>
    </PageLayout>
  )
}
