import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Context, ContextType } from "react";
import Seo from "../../components/Seo";

type props = {
  params: Array<any>;
};

const Detail: React.FC<props> = ({ params }) => {
  const [title, id]: any = params || [];

  return (
    <div>
      <Seo title={title} />
      <h4>{title}</h4>
    </div>
  );
};

export default Detail;

export function getServerSideProps({ params }: GetServerSidePropsContext) {
  return {
    props: { params: params?.params },
  };
}
