import type { ErrorPageProps } from "./types";

export function ErrorPage(props: ErrorPageProps) {
  return (
    <div className="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] bg-white lg:grid-cols-[max(50%,36rem),1fr]">
      <header className="w-full px-6 pt-6 mx-auto max-w-7xl sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
        <a href="/home">
          <span className="sr-only">SST</span>
          <div className="flex items-center h-16 shrink-0 sidebar-logo">
            <img className="w-1 h-1" src="src/assets/nrllogo.svg" alt="Nrl" />
          </div>
        </a>
      </header>
      <main className="w-full px-6 py-24 mx-auto max-w-7xl sm:py-36 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
        <div className="max-w-lg">
          <p className="font-semibold leading-8 text-green-600 text-7xl">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-green-700 sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mt-6 text-base leading-7 text-green-600">
            You have dodged the play, but we're still in the game!
          </p>
          <p className="mt-6 text-base leading-7 text-green-600">
            {props.message}
          </p>
          <div className="mt-10">
            <a
              href="/home"
              className="text-sm font-semibold leading-7 text-green-600"
            >
              <span aria-hidden="true">&larr;</span> Back to home
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
