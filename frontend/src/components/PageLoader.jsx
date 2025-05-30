import {LoaderIcon} from "lucide-react";
import React from "react";
import {LoaderCircle} from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderIcon className="animate-spin text-primary" size={48} />
      {/* <LoaderCircle className="animate-spin text-primary" size={48} /> */}
    </div>
  );
};

export default PageLoader;
