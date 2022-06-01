export default function MarketStats() {
	return (
		<div className="relative bg-white">
			<div className="h-56 bg-indigo-600 sm:h-72 lg:absolute lg:left-0 lg:h-full lg:w-1/2">
				<img
					className="w-full h-full object-cover"
					src="clothing-pile.jpeg"
					alt="Support team"
				/>
			</div>
			<div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:py-16">
				<div className="max-w-2xl mx-auto lg:max-w-none lg:mr-0 lg:ml-auto lg:w-1/2 lg:pl-10">
					<div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
							Environmental Benefits
						</h2>
					</div>

					<p className="mt-6 text-lg text-gray-500">
						Every time we buy a new item we leave a small footprint
						on the planet. We must find ways to reuse what we
						already have, to avoid wasting resources that just end
						up in landfill. Buying pre-loved items reduces the
						impact we have on the planet, and encourages a more
						resilient local economy. For the global adoption of
						cryptocurrencies, we need to build paths towards
						sustainable spending.
					</p>
					<div className="mt-8 overflow-hidden">
						<dl className="-mx-8 -mt-8 flex flex-wrap">
							<div className="flex flex-col px-8 pt-8">
								<dt className="order-2 text-base font-medium text-gray-500">
									{/* https://www.statista.com/statistics/826162/apparel-resale-market-value-worldwide/ */}
									{/* https://www.futuremarketinsights.com/reports/secondhand-apparel-market */}
									Second-hand market valuation
								</dt>
								<dd className="order-1 text-2xl font-extrabold text-indigo-600 sm:text-3xl">
									$ 44 billion
								</dd>
							</div>
							<div className="flex flex-col px-8 pt-8">
								<dt className="order-2 text-base font-medium text-gray-500">
									Textile waste created annually
								</dt>
								<dd className="order-1 text-2xl font-extrabold text-indigo-600 sm:text-3xl">
									{/* https://www.fashionrevolution.org/waste-is-it-really-in-fashion/#:~:text=The%20number%20of%20garments%20produced,is%20landfilled%20or%20burned%20globally. */}
									92 million tons
								</dd>
							</div>
							<div className="flex flex-col px-8 pt-8">
								<dt className="order-2 text-base font-medium text-gray-500">
									{/* https://www.adevinta.com/stories/articles/second-hand-trade-has-big-environmental-impact-according-to-adevinta-study */}
									CO2 emissions saved through second hand
									goods
								</dt>
								<dd className="order-1 text-2xl font-extrabold text-indigo-600 sm:text-3xl">
									22.8 million tons
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
}
