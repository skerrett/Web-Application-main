import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { ItemType } from "./UnityComponent";

type ButtonProps = {
    progression: number;
};

const LoadingBar = ({
    progression,
}: ButtonProps): JSX.Element => {
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (counter < 99) {
                let d = Math.random();
                let d2 = Math.random();
                let increment = d < 0.5 ? 1 : 0.001;
                let increment2 = d2 < 0.5 ? 2 : 0.001;
                setCounter(counter + increment + increment2);
            }
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [counter]);

    const loadingPct = () => {
        const result = Math.round(progression * 100);
        if (result < 0.1) {
            return parseInt(counter.toFixed());
        } else {
            return result;
        }
    }

    return (
        <ProgressBar now={loadingPct()} label={`Loading ${loadingPct()}%`} />
    )
}

export default LoadingBar