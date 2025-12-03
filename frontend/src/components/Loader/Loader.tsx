import Loading from "../../assets/animations/box-loading.json";
import Lottie from "lottie-react";

export function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie animationData={Loading} className="h-56" />
    </div>
  );
}
