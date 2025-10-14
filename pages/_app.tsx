import { appWithTranslation } from 'next-i18next';
import '../src/app/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
