import Link from "next/link";
import * as React from "react";

export function Copyright(props: any) {
  return (
    <p {...props}>
      {"Copyright © "}
      <Link href="/">Dorten</Link> {new Date().getFullYear()}
      {"."}
    </p>
  );
}
