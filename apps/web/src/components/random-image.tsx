import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useEffect, useState } from "react";

const baseUrl = new URL(
    typeof window !== "undefined" ? window.location.origin : "https://profile.iforana.com"
)

export function RandomImage() {
    const [seed, setSeed] = useState("")
    const randomize = () => {
        const CONSONANT = "bcdfghjklmnpqrstvwxyz"
        const VOWEL = "aeiou"
        let seed = ""
        for (let i = 0; i < 3; i++) {
            seed += CONSONANT[Math.floor(Math.random() * CONSONANT.length)]
            seed += VOWEL[Math.floor(Math.random() * VOWEL.length)]
        }
        setSeed(seed)
    }
    
    useEffect(() => {
        randomize()
    }, [])

    const src = new URL(`/api/collection/animal-v0/${seed}`, baseUrl)

    return <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
            <Input defaultValue={seed} onChange={(e) => setSeed(e.target.value)} />
            <Button onClick={randomize}>Random</Button>
        </div>
        <div className=" w-72 max-w-full aspect-square overflow-hidden rounded-md mx-auto">
            <img className="h-full w-full object-cover" key={seed} src={src.toString()} alt="Random" />
        </div>
        <div className="flex max-md:flex-col gap-2">
            <Input value={src.toString()} className="pointer-events-none font-mono" />
            <Button onClick={() => navigator.clipboard.writeText(src.toString()).catch(() => {})}>Copy</Button>
        </div>
    </div>
}