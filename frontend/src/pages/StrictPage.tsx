import type { FunctionComponent } from '../common/types';

export const StrictPage = (): FunctionComponent => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen font-bold bg-gray-900 ">
      <p className="text-4xl text-white">I am a strict page with route is defined as "/strict-page".</p>
    </div>
  );
};
