import Link from "next/link";

export default function FeatureUnderDevelopment({
	description,
}: {
	description: string;
}) {
	return (
		<div className="bg-white pt-16 sm:py-24">
			<div className="relative sm:pt-16">
				<div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
					<div className="relative rounded-2xl px-6 pt-8 overflow-hidden sm:px-12 sm:py-20">
						<div className="relative">
							<div className="sm:text-center">
								<h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
									This feature is still being developed!
								</h2>
								<p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-500">
									{description}
								</p>
							</div>
							<form
								action="#"
								className="mt-12 sm:mx-auto sm:max-w-lg sm:flex"
							>
								<div className="min-w-0 flex-1">
									<label
										htmlFor="cta-email"
										className="sr-only"
									>
										Email address
									</label>
									<input
										id="cta-email"
										type="email"
										className="block w-full shadow-sm rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
										placeholder="Enter your email"
									/>
								</div>
								<div className="mt-4 sm:mt-0 sm:ml-3">
									<Link href="/">
										<button
											type="submit"
											className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
										>
											Notify me
										</button>
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
