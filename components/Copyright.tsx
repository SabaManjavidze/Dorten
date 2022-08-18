import * as React from "react";

export function Copyright(props: any) {
  return (
    <p variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <a color="inherit" href="https://mui.com/">
        Dorten
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </p>
  );
}
