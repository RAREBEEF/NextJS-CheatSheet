import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Nav from "../components/Nav";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
      <style jsx global>{`
        a {
          text-decoration: none;
        }
      `}</style>
    </Layout>
  );
};

export default MyApp;
