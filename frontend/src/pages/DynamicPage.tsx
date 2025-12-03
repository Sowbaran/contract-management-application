import type { FunctionComponent } from "../common/types";
import { useParams } from "@tanstack/react-router";

export const DynamicPage = (): FunctionComponent => {
  const { page }: { page: string } = useParams({ strict: false });

  return (
    <>
      <p className="text-6xl text-black">
        I am a dynamic page with route - {page}
      </p>
    </>
  );
};
