import { Loader2 } from "lucide-react";

const Loader = ({ iconSize = 30 }: { iconSize?: number }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="animate-spin" size={iconSize} />
    </div>
  );
};

export default Loader;
