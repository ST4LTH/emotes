import { createMemo, createSignal } from "solid-js";
import DeleteIcon from "../assets/icons/delete";
import emoteStore, { emoteActions } from "../store";

const Settings = () => {
    const getCategoryByName = (categoryName: string) =>
        emoteStore.emotes.find((category) => category.name === categoryName);

    const keyboundEmotes = createMemo(() => emoteStore.keybindEmotes);

    // A signal to track which emotes have been removed
    const [removedEmotes, setRemovedEmotes] = createSignal<string[]>([]);

    return (
        <div class="px-4 min-h-[30vh]">
            <p class="text-xl font-semibold pb-2">Keybinds</p>
            <p class="text-base text-neutral-400 font-semibold pb-4">
                Keybinds kan ändras i fivem inställningar.
            </p>
            <div class="flex flex-col gap-2">
                {Object.keys(keyboundEmotes())
                    .filter((emoteName) => !removedEmotes().includes(emoteName)) // Filter out removed emotes
                    .map((emoteName) => {
                        const categoryName = keyboundEmotes()[emoteName]?.category;
                        const category = categoryName ? getCategoryByName(categoryName) : null;
                        if (!category) return null;

                        const emote = category.emotes.find(
                            (e) => e.id.toLowerCase() === emoteName.toLowerCase()
                        );
                        if (!emote) return null;

                        return (
                            <div class="text-lg flex items-center gap-3 bg-neutral-800 rounded px-3 py-3 pr-4">
                                <span class="font-semibold">{emote.name}</span>
                                <span class="text-sm">{category.name}</span>
                                <div class="flex-grow" />
                                <p class="text-xs bg-black/40 border border-neutral-600 rounded px-2 py-1">
                                    {keyboundEmotes()[emoteName]?.key}
                                </p>
                                <DeleteIcon
                                    onClick={() => {
                                        emoteActions.removeKeybind(emoteName); 
                                        setRemovedEmotes((prev) => [...prev, emoteName]);
                                    }}
                                    class="h-7 w-7 cursor-pointer"
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Settings;