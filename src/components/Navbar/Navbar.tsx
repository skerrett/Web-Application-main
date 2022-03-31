import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Link } from "react-router-dom";
import React, { Dispatch, SetStateAction } from "react";
import ConnectButton from "../../components/ConnectWallet";
import DisconnectButton from "../../components/DisconnectWallet";
import { routes } from '../../index';

type ButtonProps = {
    Tezos: TezosToolkit;
    setContract: Dispatch<SetStateAction<any>>;
    setWallet: Dispatch<SetStateAction<any>>;
    setUserAddress: Dispatch<SetStateAction<string>>;
    setUserBalance: Dispatch<SetStateAction<number>>;
    setStorage: Dispatch<SetStateAction<number>>;
    contractAddress: string;
    setBeaconConnection: Dispatch<SetStateAction<boolean>>;
    setPublicToken: Dispatch<SetStateAction<string | null>>;
    wallet: BeaconWallet;
    publicToken: string | null;
    userAddress: string;
    userBalance: number;
    setTezos: React.Dispatch<React.SetStateAction<TezosToolkit>>
};

const Navbar = ({
    Tezos,
    setContract,
    setWallet,
    setUserAddress,
    setUserBalance,
    setStorage,
    contractAddress,
    setBeaconConnection,
    setPublicToken,
    wallet,
    publicToken,
    userAddress,
    userBalance,
    setTezos,
}: ButtonProps): JSX.Element => {

    const [navbarOpen, setNavbarOpen] = React.useState(false);

    const splitUserAddress = (address: string) => {
        const first = address.substr(0, 5)
        const last = address.substr(address.length - 5)
        return first + "..." + last
    }
    return (
        <>
            <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-transparent">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <a
                            className="text-md font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                        >
                            PiXl
                        </a>
                        <button
                            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div className={
                            "lg:flex flex-grow items-center justify-center" +
                            (navbarOpen ? " flex" : " hidden")
                        }>
                        {routes.map(route => <Link to={route.path} key={route.path} style={{marginLeft: 15, marginRight: 15}}>{route.label}</Link> )}
                    </div>
                    <div
                        className={
                            "lg:flex items-center" +
                            (navbarOpen ? " flex" : " hidden")
                        }
                        id="example-navbar-danger"
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            <li className="nav-item">
                                {(!publicToken && !userAddress && !userBalance) ?
                                    <ConnectButton
                                        Tezos={Tezos}
                                        setContract={setContract}
                                        setPublicToken={setPublicToken}
                                        setWallet={setWallet}
                                        setUserAddress={setUserAddress}
                                        setUserBalance={setUserBalance}
                                        setStorage={setStorage}
                                        contractAddress={contractAddress}
                                        setBeaconConnection={setBeaconConnection}
                                        wallet={wallet}
                                    />
                                    :
                                    <div className="flex flex-row gap-4">
                                        <DisconnectButton
                                            wallet={wallet}
                                            setPublicToken={setPublicToken}
                                            setUserAddress={setUserAddress}
                                            setUserBalance={setUserBalance}
                                            setWallet={setWallet}
                                            setTezos={setTezos}
                                            setBeaconConnection={setBeaconConnection}
                                        />
                                        {splitUserAddress(userAddress)}
                                    </div>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar