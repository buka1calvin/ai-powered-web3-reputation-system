import React from "react";

export interface RouteChild {
  path: string;
  element: React.ComponentType | (() => React.JSX.Element);
  protected?: boolean;
  allowedRoles?: string[];
}

export interface RouteConfig {
  path: string;
  element: React.ComponentType | (() => React.JSX.Element);
  children?: RouteChild[];
  protected?: boolean;
  allowedRoles?: string[];
}
