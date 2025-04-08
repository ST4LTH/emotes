import { createSignal, createEffect, Show, onMount, onCleanup } from "solid-js"
import SearchIcon from "../assets/icons/search"
import Input from "./ui/input"
import emoteStore from "../store"
import EmoteList from "./emoteList"

export default function Menu() {
    const [searchQuery, setSearchQuery] = createSignal("")
    const [filteredEmotes, setFilteredEmotes] = createSignal<any[]>([])

    createEffect(() => {
        if (searchQuery().trim() === "") {
            setFilteredEmotes([])
            return
        }

        const query = searchQuery().toLowerCase()
        const results: any[] = []

        emoteStore.emotes.forEach((category) => {
            const matchingEmotes = category.emotes.filter(
                (emote) =>
                    emote.name.toLowerCase().includes(query) ||
                    emote.id.toLowerCase().includes(query)
            )

            if (matchingEmotes.length > 0) {
                results.push({
                    name: category.name,
                    emotes: matchingEmotes,
                })
            }
        })

        setFilteredEmotes(results)
    })

    let inputRef: HTMLInputElement | undefined

    onMount(() => {
        if (inputRef) {
            inputRef.focus()
        }
    })

    return (
        <>
            <div class="px-3">
                <div class="relative">
                    <SearchIcon class="absolute z-10 left-3 top-4 h-7 w-7 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        placeholder="Sök"
                        class="bg-neutral-700/60 font-semibold"
                        value={searchQuery()}
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    />
                </div>
            </div>

            <div class="overflow-auto h-full max-h-[50vh] px-3 pt-1 pb-2">
                <Show
                    when={searchQuery().trim() !== ""}
                    fallback={
                        <EmoteList list={emoteStore.emotes} />
                    }
                >
                    <Show
                        when={filteredEmotes().length > 0}
                        fallback={
                            <div class="px-2 py-12 text-center text-base text-muted-foreground">
                                Ingen animation hittad :/ <br />
                            </div>
                        }
                    >
                        <EmoteList list={filteredEmotes()} toggle={true} />
                    </Show>
                </Show>
            </div>
        </>
    )
}