import * as React from "react";

export function Copyright(props: any) {
  return (
    <p {...props}>
      {"Copyright © "}
      <a href="/">Dorten</a> {new Date().getFullYear()}
      {"."}
    </p>
  );
}
