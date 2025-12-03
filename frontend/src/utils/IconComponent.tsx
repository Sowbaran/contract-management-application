import * as Icons from "@heroicons/react/24/outline";
import React from "react";

export const IconComponent: React.FC<{ iconName: string }> = ({ iconName }) => {
  const Icon = Icons[iconName as keyof typeof Icons] as React.ElementType;

  if (!Icon) {
    console.error(`Icon "${iconName}" not found.`);
    return null;
  }

  return <Icon className="h-5 w-5" />;
};
