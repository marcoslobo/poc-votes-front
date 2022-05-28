import "../global.css";
import { AppWrapper } from "../context/AppContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}
