import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body className="antialiased">
        <noscript>
            <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MRT465Q3"
                height="0"
                width="0"
                style={{
                    display: "none",
                    visibility: "hidden",
                }}
            />
        </noscript>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
