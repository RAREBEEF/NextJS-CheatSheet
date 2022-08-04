import Seo from "../components/Seo";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  movies: Array<any>;
};

const Home: React.FC<Props> = ({ movies }) => {
  const router = useRouter();

  // 쿼리스트링으로 데이터 전달
  // const onMovieClick = (id: string, title: string) => {
  //   router.push(
  //     {
  //       pathname: `/movies/${id}`,
  //       query: {
  //         title,
  //       },
  //     },
  //     `/movies/${id}`
  //   );
  // };

  // catch all url 파라미터로 데이터 전달
  const onMovieClick = (id: string, title: string) => {
    router.push(`/movies/${title}/${id}`);
  };

  return (
    <div className="container">
      <Seo title="Home" />
      {movies?.map((movie) => (
        <div
          className="movie"
          key={movie.id}
          onClick={() => {
            onMovieClick(movie.id, movie.original_title);
          }}
        >
          <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
          <h4>
            <Link href={`/movies/${movie.original_title}/${movie.id}`}>
              <a>{movie.original_title}</a>
            </Link>
          </h4>
        </div>
      ))}

      <style jsx>{`
        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 20px;
          gap: 20px;
        }
        .movie {
          cursor: pointer;
        }
        .movie img {
          max-width: 100%;
          border-radius: 12px;
          transition: transform 0.2s ease-in-out;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        }
        .movie:hover img {
          transform: scale(1.05) translateY(-10px);
        }
        .movie h4 {
          font-size: 18px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  const { results: movies } = await (
    await fetch("http://localhost:3000/api/movies")
  ).json();

  return {
    props: {
      movies,
    },
  };
}
