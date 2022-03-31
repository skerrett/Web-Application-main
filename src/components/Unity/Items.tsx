import { ItemType } from "./UnityComponent";

type ButtonProps = {
    items: ItemType[];
    addCard: (id: string, e: React.MouseEvent<HTMLElement, MouseEvent>, cardId: number | undefined) => void,
};

const Items = ({
    items,
    addCard
}: ButtonProps): JSX.Element => {
    return (
        <section className="card-list mt-2 ml-auto mr-auto items-center justify-center">
            {items.map((user) => (
                <div key={user.alt} id={user.alt} onClick={(e) => addCard(user.alt, e, user.unityCardIdentifier)} className="card">
                    <img className="ml-auto mr-auto" src={user.imageSrc} alt="this slowpoke moves" style={{
                        height: "202px",
                        width: "202px",
                    }} />
                </div>
            ))}
        </section>
    )
}

export default Items