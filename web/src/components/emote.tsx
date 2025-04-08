import { Component, createMemo, Show } from "solid-js"
import { setEmoteStore, emoteActions } from "../store"
import KeyIcon from "../assets/icons/key"
import { post } from "../utils"

type dataProp = {
    id: string
    name: string
}

type emoteProps = {
    data: dataProp
    category: string
}

const Emote: Component<emoteProps> = ({ data, category }) => {
    const keybind = createMemo(() => emoteActions.getKeybind(data.id))

    const onClick = (id: string) => {
        post('emote', { id, category })
    }

    return (
        <div
            onClick={() => onClick(data.id)}
            class="flex items-center gap-3 w-full h-[3.7vh] hover:bg-neutral-700/50 rounded-md px-3 py-1.5 hover:bg-accent"
        >
            <p class="text-base font-medium">{data.name}</p>
            <div class="flex-grow" />
            <Show
                when={keybind()}
                fallback={
                    <KeyIcon onClick={
                        (e: MouseEvent) => {
                            e.stopPropagation();
                            setEmoteStore('currentKeybind', { 
                                id: data.id, 
                                category, 
                                key: '' 
                            })
                        }
                    } 
                    class="w-10 h-10 fill-neutral-300 p-2 hover:bg-neutral-600/70 rounded-full" />
                }
            >
                <p class="px-3 py-1.5 uppercase text-sm bg-yellow-500/30 text-yellow-500 rounded-full">
                    ( { keybind()?.key } ) 
                </p>
            </Show>
        </div>
    )
}

export default Emote