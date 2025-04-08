import { createSignal } from "solid-js"
import CloseIcon from "../assets/icons/close"
import EmoteStore, { emoteActions, setEmoteStore } from "../store"
import KeybindSetter from "./keybindSetter"
import Dialog from "./ui/dialog"

const KeybindDialog = () => {
    const [key, setKey] = createSignal<string>('')

    return <Dialog>
        <div class='absolute right-0 left-0 bottom-0 top-0 m-auto p-5 w-[35vh] h-fit bg-neutral-800 rounded'>
            <div class='flex justify-between'>
                <p class='font-bold text-lg'>Lägg till en keybind</p>
                <CloseIcon onClick={() => setEmoteStore('currentKeybind', null)} class="h-9 w-9 rounded-full hover:bg-neutral-700 p-1" />
            </div>
            <p class='text-sm pt-1 text-neutral-400 pb-5'>Keybinden går att ändra genom fivem keybinds</p>
            <div class='text-center pt-5 pb-3'>
                <KeybindSetter onChange={(e) => setKey(e)} />
            </div>
            <div class='flex justify-end pt-7'>
                <button 
                    class='text-sm font-semibold px-4 py-1 bg-neutral-700 rounded'
                    onClick={() => 
                        EmoteStore.currentKeybind ? 
                            emoteActions.setKeybind(
                                EmoteStore.currentKeybind?.id, 
                                EmoteStore.currentKeybind?.category, 
                                key()
                            )
                        : null
                    } 
                >
                    Godkänn
                </button>
            </div>
        </div>
    </Dialog>
}

export default KeybindDialog