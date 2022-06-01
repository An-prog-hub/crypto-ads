import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import Layout from "../components/Layout";
import ListingsProvider from "../context/listings";
import App from "next/app";
import AccountsProvider from "../context/accounts";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<AccountsProvider>
				<ListingsProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</ListingsProvider>
			</AccountsProvider>
		</>
	);
}

MyApp.getInitialProps = async (appContext: AppContext) => {
	const appProps = await App.getInitialProps(appContext);

	return { ...appProps };
};

export default MyApp;
