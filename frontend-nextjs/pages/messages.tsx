import FeatureUnderDevelopment from "../components/FeatureUnderDevelopment";

export default function Messages() {
	const description =
		"In order to complete your trades both the seller and buyer need to coordinate in person. We're working on an integrated messaging platform to allow users to finalize trades between themselves, or a trusted third party. Sign up for our newsletter to stay up to date with the latest developments. We'll let you know when we're ready to launch on mainnet.";
	return <FeatureUnderDevelopment description={description} />;
}
