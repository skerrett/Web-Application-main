import { ItemType } from "./UnityComponent";

type ButtonProps = {
    coin: ItemType[];
    sendCoin: (id: string, e: React.MouseEvent<HTMLElement, MouseEvent>, cardId: string, cardNumber:number|undefined) => void
};

const EntryCoin = ({
    coin,
    sendCoin
}: ButtonProps): JSX.Element => {
    console.log("entrycoin", coin)
    return (
        <section className="card-list mt-2 ml-auto mr-auto items-center justify-center">
            {coin.map((data, index) => (
                <div key={index}>
                    {data.id === 0 &&
                        <div key={data.alt} id={data.alt} onClick={(e) => sendCoin(data.alt, e, data.alt, data.id)} className="card entry-card">
                            <img className="ml-auto mr-auto" src={data.imageSrc} alt="this slowpoke moves" style={{
                                height: "190px",
                                width: "202px",
                                marginTop: "10px",
                            }} />
                            {/* <p className="text-black text-xl mr-auto font-serif">Entry Token</p>
                    <p className="text-black text-sm mr-auto font-serif mt-4">A magical token that grants access to the wondrous world of pixl</p> */}
                        </div>
                    }
                    {data.id === 1 &&
                        <div key={data.alt} id={data.alt} onClick={(e) => sendCoin(data.alt, e, data.alt,data.id)} className="card beets-card">
                            {/* <img className="ml-auto mr-auto" src={data.imageSrc} alt="this slowpoke moves" style={{
                                height: "202px",
                                width: "202px",
                            }} /> */}
                            {/* <p className="text-black text-xl mr-auto font-serif">Entry Token</p>
                    <p className="text-black text-sm mr-auto font-serif mt-4">A magical token that grants access to the wondrous world of pixl</p> */}
                        </div>
                    }
                </div>
            ))}
        </section>
    )
}

export default EntryCoin