import Head from "next/head";

type Props = {
  title: string;
};

const Seo: React.FC<Props> = ({ title }) => {
  return (
    <Head>
      <title>{title} | Next Movies</title>
    </Head>
  );
};

export default Seo;
