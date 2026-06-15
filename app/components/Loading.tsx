import React from "react";

const Loading = ({ text = "" }: { text?: string }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
