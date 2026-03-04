import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import "../styles/globals.css";

// allow pages to specify a custom layout
export type NextPageWithLayout = AppProps['Component'] & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({ Component, pageProps }: AppProps) {
  const Page = Component as NextPageWithLayout;
  const getLayout = Page.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      {getLayout(<Page {...pageProps} />)}
    </AuthProvider>
  );
}
