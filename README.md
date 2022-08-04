# **설치**

`$npx create-next-app@latest [--typescript]`

## **파싱 에러**

<a href="https://velog.io/@drrobot409/Next.js-Parsing-error-Cannot-find-module-nextbabel-%ED%95%B4%EA%B2%B0">파싱 에러 해결 방법</a>  
작업영역에 다른 프로젝트가 있을 경우 충돌하는 것으로 보인다.

<br/>
<br/>

# **SSR**

NextJS와 ReactJS 의 큰 차이점 중 하나는 렌더링 방식이다.

브라우저가 ReactJS 앱을 요청하고 서버로부터 받아오면 HTML은 비어있는 상태로 도착하게 된다. 이후 함께 받아온 js 파일을 해석하여 비어있는 화면을 채우고 렌더링하게 되는데 이러한 방식을 CSR 이라고 한다. 이러한 방식의 가장 큰 단점은 SEO와 초기 로딩의 빈 화면이다.

반면에 브라우저가 NextJS 앱을 요청하면 서버로부터 (거의) 온전한 상태의 HTML을 받아오게 된다. 서버에서 js를 일부 해석하여 HTML을 렌더링한 후 브라우저로 보내기 때문이다. 유저는 긴 초기 로딩 없이도 렌더링된 웹사이트를 볼 수 있다. 이 때의 HTML은 initial state이며, 이 후 브라우저가 함께 받아온 js 파일을 해석하면 이미 렌더링 되어있던 HTML과 연결되어 온전한 상태의 ReactJS 앱으로써 동작하게 된다. 이러한 방식을 SSR 이라고 한다.

<br/>
<br/>

# **Routing**

## **Pages**

### **url 경로 생성**

NextJS는 pages 폴더 내부의 컴포넌트(페이지)를 자동으로 라우팅해준다.  
페이지의 경로는 파일 이름으로 자동 설정되며, `index.js` 파일은 "/" 을 가리킨다. 컴포넌트 이름은 경로에 관여하지 않는다.

<br/>

### **하위 경로 생성**

하위 경로를 포함하고 있는 경로를 생성하기 위해서는 하위 폴더로 만들어야 한다. pages 내부에 폴더를 생성하면 해당 폴더명으로 경로가 생성되며, 이렇게 생성된 경로는 하위 경로를 갖을 수 있다. 해당 폴더 내부에 `index.js` 를 추가하여 해당 경로에서 렌더링할 컴포넌트를 생성할 수 있으며, 다른 이름의 파일을 추가할 경우 하위 경로로 들어가게 된다.

<br/>

### **url 파라미터**

url 파라미터를 생성할 때는 파일명을 `[파라미터명].tsx` 처럼 대괄호 안에 파라미터명을 넣어서 작성하면 된다.

<br/>

### **Catch All url**

복수의 파라미터를 모두 받아오는 경로를 생성할 때는 `[...params].tsx` 처럼 파일명을 작성한다. params 부분은 마음대로 작명해도 되며 ...은 필수로 포함되어야 한다.

params는 `useRouter().query.params` 에 배열로 저장된다.

페이지에서 `useRouter().query.params`에 접근하여 뭔가 처리를 하려하면 에러가 뜨게 되는데, SSR 방식으로 백엔드에서 먼저 렌더링되는 과정에서 `useRouter().query.params` 의 초기값은 undefined이기 때문에 에러가 발생하는 것이다.  
따라서 `useRouter().query.params || []` 와 같이 undefined일 경우 빈 배열을 전달해주는 방법으로 에러를 방지할 수 있다.

위에서 말한바와 같이 브라우저는 백엔드에서 params가 비어있는 상태로 HTML을 받아오는데, SEO가 중요한 상황이거나 백엔드가 브라우저로 HTML을 전달할 때 params 데이터가 포함되어 있기를 원하는 경우 `getServerSideProps()` 의 매개변수 `context` 에 있는 prams를 백엔드에서 미리 받아와서 사용할 수도 있다. (아래 예시)

```js
const About = ({ params }) => {
  const [title]: any = params || [];

  return (
    <div>
      <h4>{id}</h4>
    </div>
  );
};

export function getServerSideProps({ params }: GetServerSidePropsContext) {
  return {
    props: { params: params?.params },
  };
}
```

<br/>

## **useRouter**

`useRouter()` 훅으로 현재 url에 대한 데이터를 가져오고 제어할 수 있다.

### **push()**

`useRouter()` 의 `push()` 메소드로 url을 이동시킬 수 있다.

```js
const router = useRouter();
router.push("/about");
```

#### **query string**

`push()` 메소드를 이용해 url을 이동할 때 쿼리스트링을 함께 전달할 수 있다.

```js
// /movies/12345?title=rarebeef
router.push({
  pathname: `/movies/${id}`,
  query: {
    title,
  },
});
```

`push()` 에 두번째 인자를 전달하여 쿼리스트링을 숨기고 겉으로 보여질 url을 지정할 수 있다.  
숨겨진 쿼리스트링은 `useRouter().query` 로 접근할 수 있다.

```js
router.push(
  {
    pathname: `/movies/${id}`,
    query: {
      title,
    },
  },
  `/movies/${id}`
);
```

<br/>

## **Link**

Next 앱의 nav에서 SPA의 라우팅 환경을 제공하기 위해서는 `<a>` 태그 대신 `<Link>` 컴포넌트를 사용해야 한다.

```js
import Link from "next/link";

const Nav = () => {
  return (
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/about">
        <a>About</a>
      </Link>
    </nav>
  );
};

export default Nav;
```

`<Link>` 컴포넌트를 사용하더라도 그 내부에 `<a>` 태그를 넣어두는 것이 일반적이다. `<a>` 태그가 없어도 정상 작동하지만 `<Link>` 컴포넌트에는 스타일이나 클래스 등을 부여할 수 없기 때문에 이를 위해 `<a>` 태그를 내부에 남겨둔다. 또한 SEO 측면에서도 장점이 있기 때문에 NextJS는 Link 태그 안에 `<a>` 태그를 넣어서 사용할 것을 권장하고 있다.

### **query string**

아래의 방법으로 url을 이동할 때 쿼리스트링을 함께 전달할 수 있다.

```js
// /movies/12345?title=rarebeef
<Link
  href={{
    pathname: `/movies/${id}`,
    query: {
      title,
    },
  }}
>
  <a>{title}</a>
</Link>
```

`as` prop을 추가로 전달하여 쿼리스트링을 숨기고 겉으로 보여질 url을 지정할 수 있다.  
숨겨진 쿼리스트링은 `useRouter().query` 로 접근할 수 있다.

```js
<Link
  href={{
    pathname: `/movies/${id}`,
    query: {
      title,
    },
  }}
  as={`/movies/${id}`}
>
  <a>{title}</a>
</Link>
```

<br/>
<br/>

# **Style**

## **module.css**

기존 react의 모듈 방식과 동일하다.

추가로 커스텀 컴포넌트에서는 일반 css의 import가 불가능하며 module.css 파일만 import할 수 있다.

오직 \_app.js 파일에서만 일반 css의 import가 가능하다.

 <br/>

## **Styled JSX**

Styled JSX는 NextJS만의 스타일 선언 방식이다.

컴포넌트가 반환하는 JSX 트리 내부에 ` <style jsx>{``}</style> ` 태그를 삽입하고 그 안에 스타일 선언문을 작성하는 방식이다. 이는 HTML의 `<style>` 태그의 작성법과 비슷하다.

이 방식은 module.css 방식과 마찬가지로 스타일이 적용되는 요소에 랜덤 해시값을 적용하여 다른 컴포넌트와 스타일이 충돌하는 것을 방지한다.

```js
export default function Home() {
  return (
    <div>
      <h1>안녕하세요</h1>
      <style jsx>{`
        div {
          background-color: orange;
        }
        h1 {
          font-size: 30px;
        }
      `}</style>
    </div>
  );
}
```

<br/>

### **vscode-styled-components**

vscode 확장 프로그램 vscode-styled-components를 설치하면 Styled JSX로 작성한 스타일 선언문에 css 색상 하이라이트가 적용된다.

<br/>

### **Styled JSX Sass**

@styled-jsx/plugin-sass 를 설치하면 Styled JSX 선언 방식에서 Sass(scss) 문법을 사용할 수 있다.

1. `$npm i -D @styled-jsx/plugin-sass`

2. `.babelrc.json` 파일 내부에 아래 내용 추가

```json
{
  "presets": [
    [
      "next/babel",
      {
        "styled-jsx": {
          "plugins": ["@styled-jsx/plugin-sass"]
        }
      }
    ]
  ]
}
```

<br/>

### **Global style**

Styled JSX에서 `<style jsx global>` 처럼 `<style>` 태그에 `global` 프롭을 추가할 경우 해당 선언문은 전역 스타일 선언문이 되어 다른 컴포넌트에도 영향을 주게 된다.

주의할 점, 전역 스타일은 페이지에 따라서 적용 된다는 것이다.  
index.js 에서 선언한 전역 스타일은 "/" 경로에 있을 때만 적용되며 "/profile" 이나 "/about" 등 다른 페이지로 이동할 경우 index.js에서 선언한 전역 스타일은 적용되지 않는다. 페이지별 전역 스타일을 선언할 때는 유용하지만 그렇지 않은 경우에서는 주의해야한다.

페이지에 구애받지 않는 전역 스타일을 선언하기 위해서는 바로 아래 나오는 App 컴포넌트를 사용해야한다.

<br/>
<br/>

# **App component**

App 컴포넌트는 반드시 pages 폴더 내에 `_app.js(tsx)` 이라는 파일명으로 존재해야 한다.  
이 App 컴포넌트 내부에서는 페이지 간의 공통 레이아웃(nav, footer 등), 공통 state, 전역 스타일 등 여러가지를 설정할 수 있다.

Next.js 는 페이지를 렌더링하기 이전에 이 App 컴포넌트를 우선적으로 렌더링한다.

<br/>

## **기본 구조**

기본적인 구조는 아래와 같다.

```jsx
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
```

App 컴포넌트는 2가지의 props를 받아온다.

Component는 현재 페이지, 즉 pages 폴더 내부에 들어있는 컴포넌트를 의미한다. NextJS가 제일 먼저 App 컴포넌트를 렌더링하면 그 뒤에 prop으로 받아오는 Component(page)가 렌더링되는 방식이다.

pageProps은 getInitialProps, getStaticProps, getServerSideProps를 통해 가져온 초기 속성값을 의미한다.

<br/>

## **공통 레이아웃**

nav, footer 등 모든 페이지에서 출력할 공통 레이아웃을 지정할 수 있다.

```jsx
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </>
  );
};

export default MyApp;
```

<br/>

## **전역 스타일**

아래의 방법으로 전역 스타일을 선언할 수 있다.

```js
import type { AppProps } from "next/app";
import Nav from "../components/Nav";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
      <style jsx global>{`
        a {
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

export default MyApp;
```

App 컴포넌트에서 global.css 파일을 import하여 전역 스타일을 선언하는 방법도 있다.

<br/>
<br/>

# **Pattern: Layout**

레이아웃 패턴은 공통 레이아웃을 만들 때 사용되는 패턴이다.  
Layout 컴포넌트를 별도로 생성하고 `_app` 에서 import하여 사용하게 된다.

`_app` 컴포넌트에 있는 내용을 Layout 컴포넌트로 분리하여 `_app` 의 내용을 가볍게 할 수 있다는 장점이 있다.

1. Laytout

```js
import Nav from "./Nav";
import React from "react";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Nav />
      <div>{children}</div>
    </>
  );
};

export default Layout;
```

2. \_app

```js
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Nav from "../components/Nav";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
```

<br/>
<br/>

# **Head**

Head 컴포넌트는 NextJS의 장점 중 하나인 SEO에서 중요한 역할을 한다.  
페이지별로 HTML head 태그의 내용을 다르게 설정할 수 있도록 도와준다.

일반적인 사용법은 아래와 같다.

```js
import Nav from "../components/Nav";
import Head from "next/head";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
```

아래와 같이 별도의 컴포넌트로 분리하여 사용하는 방법도 존재한다.

1. Seo.tsx

```js
import Head from "next/head";

type Props = {
  title: string,
};

const Seo: React.FC<Props> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};

export default Seo;
```

2. index.tsx

```js
import Nav from "../components/Nav";
import Head from "next/head";
import Seo from "../components/Seo";

const Home = () => {
  return (
    <div>
      <Seo title="Home"></Seo>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
```

<br/>
<br/>

# **public 접근**

public 경로의 파일에 아래와 같은 방법으로 접근이 가능하다.

```js
<img src="/logo.svg" alt="Logo" />
```

<br/>
<br/>

# **next.config.js**

## **redirects**

`next.config.js` 에서 사용자가 사이트의 특정 주소로 접속했을 때 다른 주소로 리디렉션 되도록 설정할 수 있다.

아래는 `/account`로 접속한 사용자들을 `/profile`로 리디렉션하는 예시이다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/profile",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

`source` 경로에 접근하면 `destination` 으로 리디렉션하게 된다. `permanent` 는 이 리디렉션이 영구적인 조치인지, 임시적인 조치인지에 대해 명시하는 역할을 한다.

<br/>

### **:path & :path\***

`source` 와 `destination` 의 경로 뒤에 `/:path` 를 붙일 수 있다.  
이 :path는 해당 url 뒤에 추가적인 경로가 존재하는지를 의미한다. 이 :path는 리디렉션 후에도 유지된다.  
(예시: `/account/edit` => `/profile/edit`)

주의할 점은 사용자가 접속한 경로에 `:path`에 해당하는 부분이 없다면 리디렉션되지 않는다는 점이다. `source` 와 `destination`에 `/:path` 를 붙였다면 하위 경로가 없을 경우 리디렉션은 동작하지 않는다.

추가로 `/:path` 뒤에 `*`를 붙일 수 있는데, 아래에 있을 수도 있는 모든 경로를 의미한다.  
`*`은 `/:path`와는 다르게 있던 없던 리디렉션이 동작한다.

<br/>

## **rewrites**

rewrites도 redicrects와 마찬가지로 리디렉션 시키는 역할을 하지만 redicrects는 리디렉션된 url이 유저의 눈에도 보이는 반면에 rewrites는 실제 url은 숨기고 가짜 url을 내놓는 마스킹을 거치기 때문에 유저는 알 수 없다는 차이점이 존재한다.

이러한 기능은 API 키를 숨기는데 자주 사용된다.

```js
/** @type {import('next').NextConfig} */

// 실제 사용할 때는 환경변수로 분리하는 것이 좋다.
const API_KEY = "1235719847abcdef";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/weather",
        destination: `https://api.weather.com/week?api_key=${API_KEY}`,
      },
    ];
  },
};

module.exports = nextConfig;
```

기존의 api 요청 주소를 `api/weather` 로 rewrite 했기 때문에 fetch는 아래와 같이 실행할 수 있다.

```js
useEffect(() => {
  (async () => {
    const { results } = await (await fetch("api/weahter")).json();
    setWeather(results);
  })();
}, []);
```

<br/>
<br/>

# **getServerSideProps**

`getServerSideProps()` 함수를 작성하여 원하는 내용을 백엔드에서 실행할 수 있다.  
백엔드에서 특정 작업이 필요한 컴포넌트 문서에 함께 작성한다.

백엔드에서만 실행된다는 특징 때문에 API를 호출하고 key를 숨기는데 사용하기도 한다.  
단, 이는 API의 응답을 모두 받은 후 페이지를 렌더링하고 싶은 경우에만 사용된다. 백엔드에서 API를 호출한 후 데이터를 포함한 HTML을 렌더링하고 브라우저로 보내기 때문이다.  
응답이 끝나기 전까지는 렌더링되지 않는 단점이 있는 반면 데이터가 모두 들어있는 HTML을 받아올 수 있다는 장점이 존재한다.

작성한 함수는 `export` 해야하며, 이름은 변경할 수 없다.  
`props` 라는 키를 갖는 객체를 반환하는데, 이 `props`에는 원하는 데이터를 담으면 되며 데이터를 가져올 때는 해당 컴포넌트의 prop으로 불러오면 된다.  
`async` 는 필요에 따라 붙일 수 있다.

```js
export default function Home({ weather }) {
  return (
    <div>
      {weather.map((weather) => (
        <div key={weather.country}>{weather.weather}</div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const { results: weather } = await (
    // getServerSideProps 내부에서는 절대경로로 입력해야한다.
    await fetch("http://localhost:3000/api/weather")
  ).json();
  return {
    props: {
      weather,
    },
  };
}
```

<br/>
<br/>

# **404 Not Found**

NextJS는 404 Not Found 페이지를 기본적으로 제공하지만 이를 커스텀하고 싶다면 pages 폴더 내에 `404.tsx` 파일을 생성하면 된다.
