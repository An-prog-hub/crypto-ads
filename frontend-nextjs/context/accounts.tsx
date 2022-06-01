import React, { useEffect, useState } from "react";

import getWeb3 from "../utils/getWeb3";

export const AccountsContext = React.createContext({});

const AccountsProvider = ({ children }: any) => {
	const [loading, setLoading] = useState(true);

	const [account, setAccount] = useState("");

	const getAccounts = async () => {
		const newAccount = await getWeb3.getAccounts();
		setAccount(newAccount);
		setLoading(false);
	};

	useEffect(() => {
		getAccounts();
	}, []);

	return (
		<AccountsContext.Provider
			value={{
				account,
				getAccounts,
			}}
		>
			{children}
		</AccountsContext.Provider>
	);
};

export default AccountsProvider;
