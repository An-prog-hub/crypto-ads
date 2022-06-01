import type { NextPage } from "next";
import Head from "next/head";
import FAQs from "../components/Faqs";
import FeatureListGrid from "../components/FeatureListGrid";
import LandingPageHeader from "../components/LandingPageHeader";
import MarketStats from "../components/MarketStats";
import NewsLetter from "../components/NewsLetter";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Barrio</title>
				<meta name="description" content="Barrio" />
				<link rel="icon" href="/logo.png" />
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
			</Head>

			<LandingPageHeader />
			<FeatureListGrid />
			<MarketStats />
			<FAQs />
			<NewsLetter />
			<footer className={styles.footer}>
				<p>Copyright &copy; 2022 Barrio</p>
				<span className={styles.logo}></span>
			</footer>
		</div>
	);
};

export default Home;
