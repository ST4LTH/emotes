import { createSignal, type JSX, splitProps } from "solid-js"

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  class?: string,
}

const Input = (props: InputProps) => {
  const [local, others] = splitProps(props, ["class"])
  const [isFocused, setIsFocused] = createSignal(false)
  const [hasValue, setHasValue] = createSignal(false)


  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e: Event) => {
    setIsFocused(false)
    setHasValue((e.target as HTMLInputElement).value !== "")
  }

  const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
    setHasValue(e.currentTarget.value !== "")
    if (typeof others.onChange === "function") {
      others.onChange(e as any)
    }
  }

  return (
    <div class={"relative w-full group rounded-t-lg overflow-hidden " + local.class}>
      <input
        {...others}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        class={`placeholder:text-neutral-400 w-full pl-12 transition-all text-lg bg-neutral-900/50 border border-neutral-800 px-3 py-3 border-b-yellow-500/60 !ring-0 outline-none focus:border-b-white`}
      />
      <div
        class={`absolute bottom-0 left-0 w-full h-[0.2vh] bg-yellow-500 transition-all duration-100 
          ${isFocused() ? ` scale-x-100` : ` scale-x-0`}
          group-hover:scale-x-100`
        }
      ></div>
    </div>
  )
}

export default Input

