# Barrio Front-end

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), using Tailwind CSS.

## Getting Started

Install all dependencies

```
npm install
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it works

There are a few main pages to note:

```
http://localhost:3000/listings - this takes you to all listings
http://localhost:3000/my-listings - a list of any items associated with the connected metamask wallet
http://localhost:3000/my-offers - any offers you've made on a listing
http://localhost:3000/new-listing - an upload form to create a new listing
```

The rest of the UI should be fairly self explanatory for how you create, offer and confirm listings.

The flow works like this:

### For a standard listings

1.  Create a listing via `http://localhost:3000/new-listing`
2.  You can now see this in `http://localhost:3000/my-listings` and `http://localhost:3000/listings`
3.  You can now switch to a different account in metamask to make an offer
4.  Navigate to the listing you want to make an offer on `http://localhost:3000/listing/<id>`
5.  Once you've made an offer, you can see this in `http://localhost:3000/my-offers`
6.  At this point you'd organise with the seller to complete the exchange
7.  Once the goods are received, the buyer clicks `Confirm Buy` from `http://localhost:3000/my-offers`
8.  Once the purchase is complete, the buyer can leave a rating on the seller from `http://localhost:3000/my-offers`

### For an auction listings

Works similarly to above, except with one extra step (it's different at step 7)

1.  Create a listing via `http://localhost:3000/new-listing` check the Auction checkbox
2.  You can now see this in `http://localhost:3000/my-listings` and `http://localhost:3000/listings`
3.  You can now switch to a different account in metamask to make an offer
4.  Navigate to the listing you want to make an offer on `http://localhost:3000/listing/<id>`
5.  Once you've made an offer, you can see this in `http://localhost:3000/my-offers`
6.  At this point you'd organise with the seller to complete the exchange
7.  Once the seller is happy, they can affept your offer, by viewing `Accept Offer` in the `View Offers` modal from `http://localhost:3000/my-listings`
8.  Once the goods are received, the buyer clicks `Confirm Buy` from `http://localhost:3000/my-offers`
9.  Once the purchase is complete, the buyer can leave a rating on the seller from `http://localhost:3000/my-offers`

### For a third party listings

Again, similar to above, except when

1.  Create a listing via `http://localhost:3000/new-listing` check the third party listing checkbox and provide an ethereum wallet to use as the third party

Here instead the funds are received to the third party.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
