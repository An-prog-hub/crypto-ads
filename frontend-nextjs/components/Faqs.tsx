import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

const faqs = [
	{
		question: "Why use Barrio?",
		answer: (
			<div>
				<p className="pt-3 pb-3">
					We produce a colossal amount of goods every year, rather
					than ending up in landfill it is better for the planet to
					provide ways to re-sell and re-use items. Barrio leverages
					the escrow functionality of smart contracts with a
					blockchain based reputational proof to allow people to
					exchange goods with confidence. It puts users in control of
					their own data, and creates a collaborative ecosystem to be
					a part of.
				</p>
				<p className="pt-3 pb-3">
					The second hand market is huge, but there is currently no
					way to buy and sell individual goods (or handcraft items)
					with crypto. Since our smart contracts store the ipfs hash
					of the image of the item, it also provides the dual
					functionality of showing proof of purchase (which may be
					useful later for insurance claims) as well as proof of
					provenance which can be useful in the reselling of art,
					antiques or collectibles.
				</p>
				<p className="pt-3 pb-3">
					Since the IPFS image hash is stored in the smart contract
					data, Barrio can be used for a wide range of applications.
					It can be used to for standard listings and auctions, or you
					could get more creative and use the platform to store any
					kind of digital asset (including NFTs!) Since the image data
					is stored securely in IPFS, you can use this as proof of
					purchase in insurance claims, as well as making provenance
					easier when reselling art, antiques or other collectibles.
				</p>
			</div>
		),
	},
	{
		question: "How does Barrio work?",
		answer: (
			<div>
				<p className="pt-3 pb-3">
					Barrio allows users to list items or services for sale, and
					to make offers on these items.
				</p>
				<p className="pt-3 pb-3">
					It provides two ways of doing this: either a standard
					listing or an auction.
				</p>
				<p className="pt-3 pb-3">
					In a standard listing the price is set, and after making an
					offer, buyers arrange with the seller to organize the
					exchange. During the exchange, when the buyer is in
					possession of the items they can &ldquo;Confirm the
					purchase&rdquo; in the app - which the buyer can then verify
					before parting ways. Once a purchase is confirmed, any
					unsuccessful offers are refunded.
				</p>
				<p className="pt-3 pb-3">
					Listings are currently kept for seven days - if nobody
					confirms a buy in this time, Chainlink Keepers are used to
					refund all buyers.
				</p>
				<p className="pt-3 pb-3">
					In an auction, the listed price is a minimum, and buyers are
					able to offer any amount above this. For the seller, there
					is an additional step since they must accept an offer before
					the buyer can confirm the purchase.
				</p>
				<p className="pt-3 pb-3">
					For any type of listing, the seller may provide the Ethereum
					wallet address of a trusted third party, such as an estate
					agent, auction house or possibly a local shop. They leave
					their item with the third party, who handles the rest of the
					transactions for them. Usually, the buyer will pick somebody
					a seller is also likely to trust, so that the goods can be
					exchanged easily.
				</p>
				<p className="pt-3 pb-3">
					After a purchase is confirmed, the buyer and seller are now
					able to leave a review of each other. Over time, users
					increase their reputation by accumulating positive ratings,
					which facilitates new types of trade, such as exchange via
					post. With a high enough rating, a buyer may feel confident
					enough to confirm a purchase before receiving the goods.
				</p>
			</div>
		),
	},
	{
		question:
			"What is the difference between an auction and a standard listing?",
		answer: "In a standard listing your offer is always the same as the listing price, and the seller is free to choose out of any available offers. With an auction, the price can increase to any arbitrary amount above the asking price. The seller is still free to choose which offer to accept, but they're most likely to accept either the highest bid or a buyer with a higher rating.",
	},
	{
		question: "How does the rating system work?",
		answer: "After a purchase is confirmed, the buyer and seller are able to rate each other (out of a score from 1 - 5). This is a useful mechanism to build up reputation over time, which makes people more likely to complete trades with you. The buyer and seller may decide to post the item to each other rather than meeting up in person or using a third party - in these cases, it's useful to know the reviews left by others to know how trust worthy they are.",
	},
	{
		question: 'What\'s a "third party" listing?',
		answer: (
			<div>
				<p className="pt-3 pb-3">
					Sometimes you may want to use a trusted third party to
					complete the sale for you. In these cases, rather than the
					buyer and seller meeting up directly to exchange the goods,
					the physical items are held in escrow by a trusted third
					party.
				</p>
				<p className="pt-3 pb-3">
					This is especially useful for estate agents or auction
					houses, who may be the intermediary in possession of an
					item. Alternatively, you may choose to leave your item with
					a local shop, or a third party service provider. In the
					future, we&rsquo;d love to see an decentralized IoT
					Amazon-style locker, which is able to securely hold the
					goods, and trigger smart contract fund releases.
				</p>
			</div>
		),
	},
	{
		question: "What if I get outbid?",
		answer: "Don't worry if you get outbid, you can always make a higher counter offer if someone outbids you. You can find out whether you're the current highest bidder by visiting your offers page.",
	},
	{
		question: "What if my offer is not succesfull?",
		answer: "The smart contract that stores all listings uses Chainlink's Keeper functionality to ensure that all unsuccesful bids are returned to you after the listing ends (this is currently set to 7 days).",
	},
	{
		question:
			"What if my offer is accepted but the listing is due to end soon?",
		answer: "We're currently working on a feature to allow a buyer with an accepted offer to extend the time an item is listed for, to allow for a time to completion window.",
	},
	{
		question: "What other uses are there for Barrio?",
		answer: "It's also possible to non-physical items such as services and NFTs and other digital assets, and build up a reputation for a service that you offer. Since the IPFS hash is stored in the smart contract, it can be used to buy and sell any digital or physical item. Barrio can also be used for the service economy, making it useful for freelancers, teachers and creatives.",
	},
	{
		question: "How will Barrio's Tokenomics work?",
		answer: (
			<div>
				<p className="pt-3 pb-3">
					Currently, both buyers and sellers are rewarded in Barrio
					after completing a purchase and leaving a review.
					We&rsquo;re working on ways to use these tokens in order
					later spend them in the app, as well as providing tokens to
					anybody securing Barrio&rsquo;s data.
				</p>
				<p className="pt-3 pb-3">
					At the moment, the smart contracts simply store the funds
					without taking a commission. In the future, the contract
					will retain a small amount of Ether from the listing, which
					can be used by holders of Barrio to make further purchases.
					These will be done through a reward mechanism, where users
					have a chance to enter a raffle with their tokens, and if
					they win, they can use these credits for new purchases.
				</p>
			</div>
		),
	},
	{
		question: "What's next for Barrio?",
		answer: (
			<div>
				<p className="pt-3 pb-3">
					There are so many features we&rsquo;d like to build to make
					this a great collaborative platform and ecosystem for our
					users. Some of them are mentioned in the features list grid
					above. For the planned improvements to the Tokenomics you
					can also read the question above too.
				</p>
				<p className="pt-3 pb-3">
					In addition to all of that, we&rsquo;d like to create ways
					for Barrio users to secure and vet their data together. In
					the future, we&rsquo;d like to add the ability to
					down/upvote listings by users and potentially block sales,
					to prevent spam and other misuses. We believe that
					communities can secure their own data, and should be
					rewarded for doing so. As users gain greater ratings on the
					platform, their votes on content will be given more weight.
					Ensuring that together, we can build a collaborative
					platform where users control and secure their own data.
				</p>
			</div>
		),
	},
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function FAQs() {
	return (
		<div className="">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
					<h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
						Find out more about Barrio
					</h2>
					<dl className="mt-6 space-y-6 divide-y divide-gray-200">
						{faqs.map((faq) => (
							<Disclosure
								as="div"
								key={faq.question}
								className="pt-6"
							>
								{({ open }) => (
									<>
										<dt className="text-lg">
											<Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
												<span className="font-medium text-gray-900">
													{faq.question}
												</span>
												<span className="ml-6 h-7 flex items-center">
													<ChevronDownIcon
														className={classNames(
															open
																? "-rotate-180"
																: "rotate-0",
															"h-6 w-6 transform"
														)}
														aria-hidden="true"
													/>
												</span>
											</Disclosure.Button>
										</dt>
										<Disclosure.Panel
											as="dd"
											className="mt-2 pr-12"
										>
											<div className="text-base text-gray-500">
												{faq.answer}
											</div>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}
