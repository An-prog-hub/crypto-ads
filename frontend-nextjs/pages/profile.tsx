import FeatureUnderDevelopment from "../components/FeatureUnderDevelopment";

export default function Profile() {
	const description =
		"With the current version of the app any user with an Ethereum wallet can create or bid on a listing. Overtime, their reputation increases as they make trades. We'll always keep the ability to trade anonymously, but we know some users would like to link existing social media accounts to improve their reputation quickly. We're currently working on this feature. Sign up to our newsletter to stay up to date with the latest developments. We'll also let you know when we're ready to launch on mainnet.";
	return <FeatureUnderDevelopment description={description} />;
}
