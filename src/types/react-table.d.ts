import type { CSSProperties } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    className?: string;
    style?: CSSProperties;
  }
}
