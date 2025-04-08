import { createSignal, onMount, onCleanup } from 'solid-js'
import { Transition } from 'solid-transition-group'

const Dialog = ({ children, class: className }: { children?: any, class?: string }) => {
  const [isVisible, setIsVisible] = createSignal(false)

  onMount(() => {
    setIsVisible(true)
  })

  onCleanup(() => {
    setIsVisible(false)
  })

  return (
    <div class="bg-black/40 absolute top-0 left-0 w-full h-full z-30">
        <Transition
            onEnter={(el, done) => {
                el.animate(
                [
                    { opacity: 0, transform: 'scale(0.9)' },
                    { opacity: 1, transform: 'scale(1)' },
                ],
                {
                    duration: 200,
                    easing: 'ease-out',
                }
                ).onfinish = done
            }}
            onExit={(el, done) => {
                el.animate(
                [
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: 'scale(0.9)' },
                ],
                {
                    duration: 200,
                    easing: 'ease-in',
                }
                ).onfinish = done
            }}
            >
            {isVisible() && children}
        </Transition>
    </div>
  )
}

export default Dialog