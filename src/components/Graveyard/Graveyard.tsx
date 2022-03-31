import React, { useEffect, useState } from "react";
import { GraveyardProvider } from "../../services/graveyardProvider";

export interface GraveyardEntry {
    _id?: string;
    walletAddress: string;
    timestamp: Date;
    enemy: string,
    location: string
}

const defaultData: any[] = [];
// const defaultData = [
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Filthy Punk",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Swamp Toad",
//         location: "South Forest"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Swamp Toad",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Filthy Punk",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Meth Run",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Filthy Punk",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Meth Run",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Meth Run",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Swampy Toad",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Filthy Punk",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Swampy Toad",
//         location: "Northern Swamps"
//     },
//     {
//         wallet: '0xaaa',
//         timestamp: new Date(),
//         enemy: "Filthy Punk",
//         location: "Northern Swamps"
//     }
// ]

export const Graveyard = (): JSX.Element  => {
    const graveyardProvider = new GraveyardProvider();
    const [graveyardEntries, setGraveyardEntries] = useState<GraveyardEntry[]>(defaultData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getGraveyardEntries = async () => {
            const response = await graveyardProvider.getGraveyardEntries();
            console.log('response', response);

            if (!response.errorMessage) {
                setGraveyardEntries(response);
            }

            setLoading(false);
        }

        getGraveyardEntries();
    }, []);

    return (
    <div className="min-h-screen py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Graveyard
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            An overview of all recent player deaths
          </p>
        </div>

        <div className="mt-10">
            {
                loading ? null :
                graveyardEntries.length === 0 ?
                <p className="leading-6 italic font-medium text-gray-400 text-center py-10">No one died recently.. Or they did and we don't know about it. RIP to those guys if that's the case</p> :
                <dl className="mt-20 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-20 md:gap-y-10">

                {graveyardEntries.map((graveyardEntry, i) => (
                <div key={i} className="relative">
                    <dt>
                    <p className="text-lg leading-6 font-medium text-gray-900">{graveyardEntry.walletAddress}</p>
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">Player was killed by a {graveyardEntry.enemy} in {graveyardEntry.location}</dd>
                    <dd className="mt-2 text-sm text-gray-300">{new Date(graveyardEntry.timestamp).toUTCString()}</dd>
                </div>
                ))}
            </dl>
            }
        </div>
      </div>
    </div>
  )
}
