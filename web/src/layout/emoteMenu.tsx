import { createSignal, onCleanup, onMount, Show } from 'solid-js'
import Menu from '../components/menu';
import CloseIcon from '../assets/icons/close';
import CogIcon from '../assets/icons/cogs';
import Settings from '../components/settings';
import Dialog from '../components/ui/dialog';
import KeybindSetter from '../components/keybindSetter';
import EmoteStore, { keybindListType, setEmoteStore } from '../store';
import { post } from '../utils';
import KeybindDialog from '../components/keybindDialog';
import { useNuiEvent } from '../hooks/useNuiEvent';

const EmoteMenu = () => {
    const [settings, setSettings] = createSignal<boolean>(false)

    const close = () => {
        setEmoteStore("open", false)
        post('close')
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            close()
        }
    }

    useNuiEvent('keybinds', (data: keybindListType) => {
        console.log('keybindEmotes', JSON.stringify(data))
        setEmoteStore("keybindEmotes", data)
    })

    onMount(() => {
        window.addEventListener("keydown", handleEscapeKey)
    })

    onCleanup(() => {
        window.removeEventListener("keydown", handleEscapeKey)
    })

    return <div class="fixed select-none h-fit max-h-[60vh] right-[20vh] top-[23vh] my-auto z-50 w-[38vh] rounded-lg shadow-lg bg-neutral-900/95 text-white">
        <div class="h-[4vh] flex items-center gap-3 justify-between p-3">
            <Show
                when={settings()}
                fallback={
                    <h2 class="text-lg font-semibold">
                        Animationer
                    </h2>
                }
            >
                <h2 class="text-lg font-semibold">
                    Inställningar
                </h2>
            </Show>
            <div class='flex-grow' />
            <Show
                when={settings()}
                fallback={
                    <CogIcon onClick={() => setSettings(!settings())} class="h-9 w-9 rounded-full hover:bg-neutral-800/95 p-1" />
                }
            >
                <CogIcon onClick={() => setSettings(!settings())} class="h-9 w-9 rounded-full bg-neutral-800/95 p-1" />
            </Show>
            <CloseIcon onClick={() => close()} class="h-9 w-9 rounded-full hover:bg-neutral-800/95 p-1" />
        </div>
        <Show
            when={settings()}
            fallback={
                <Menu />
            }
        >
            <Settings />
        </Show>
        <Show when={EmoteStore.currentKeybind}>
            <KeybindDialog />
        </Show>
    </div>
}

export default EmoteMenu;