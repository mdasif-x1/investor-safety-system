import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  size = "default",
}) => {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  };

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
};
