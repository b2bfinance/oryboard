import { RouteObject } from "react-router-dom";

export type RouteInfo = RouteObject & {
  id: string;
  label?: string;
  icon?: React.ReactElement;
  children?: RouteInfo[];
  isActiveRegex?: RegExp;
};
