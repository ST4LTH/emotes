import { createSignal, onCleanup } from "solid-js"

interface KeybindSetterProps {
    onChange?: (keybind: string) => void
}

function KeybindSetter(props: KeybindSetterProps) {
    const [keybind, setKeybind] = createSignal("")
    const [isListening, setIsListening] = createSignal(false)

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!isListening()) return

        event.preventDefault()

        const key = event.key
        setKeybind(key)

        if (props.onChange) {
            props.onChange(key)
        }

        setIsListening(false)
    }

    const startListening = () => {
        setIsListening(true)
    }

    window.addEventListener("keydown", handleKeyDown)

    onCleanup(() => {
        window.removeEventListener("keydown", handleKeyDown)
    })

    return (
        <button
            class="px-4 py-2 uppercase font-semibold bg-neutral-700 rounded text-base disabled:bg-black/40"
            onClick={startListening}
            disabled={isListening()}
        >
            {"Keybind: " + (keybind() || "Klicka för att sätta")}
        </button>
    )
}

export default KeybindSetter