import { ReactComponent as Spinner } from "../assets/spinner.svg";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black/80 z-10 flex flex-col items-center justify-center">
      <div className="rounded rounded-full bg-spotify-green h-72 w-72 flex flex-col justify-center items-center p-12 text-center">
        <Spinner className="w-16 stroke-white" />
        <p className="mt-4 text-white">{message}</p>
      </div>
    </div>
  );
}
