import { Component, createEffect, createSignal, For, Show, on } from "solid-js"
import Emote from "./emote"
import RightIcon from "../assets/icons/right"
import { vhToPx } from "../utils"
import { EmoteCategory, EmoteType } from "../store"

const itemHeight = vhToPx(4.5)
const viewportHeight = vhToPx(42)

interface EmoteListProps {
    list: EmoteCategory[]
    toggle?: boolean
}

interface HeaderItem {
    id: string
    isHeader: true
    index: number
    name: string
}

interface ChildItem extends EmoteType {
    index: number
    id: string
    isChild: true
}

type FlattenedItem = HeaderItem | ChildItem;

interface VisibleItem {
    category: string
    item: FlattenedItem
    top: number
}

const EmoteList: Component<EmoteListProps> = (props) => {
    const [scrollTop, setScrollTop] = createSignal(0)
    const [openedEmotes, setOpenedEmotes] = createSignal<Set<number>>(new Set())
    const [visibleItems, setVisibleItems] = createSignal<VisibleItem[]>([])

    const calculateVisibleItems = (list: EmoteCategory[], scrollTop: number): VisibleItem[] => {
        const { startIndex, endIndex } = calculateVisibleRange(scrollTop, list)
        const expandedItemList: VisibleItem[] = []

        let globalIndex = 0
        let top = 0

        for (let i = 0; i < list.length; i++) {
            if (globalIndex >= startIndex && globalIndex <= endIndex) {
                expandedItemList.push({
                    category: list[i].name,
                    item: { id: list[i].name, isHeader: true, index: i, name: list[i].name },
                    top,
                })
            }
            globalIndex++
            top += itemHeight

            if (props.toggle || openedEmotes().has(i)) {
                for (const emote of list[i].emotes) {
                    if (globalIndex >= startIndex && globalIndex <= endIndex) {
                        expandedItemList.push({
                            category: list[i].name,
                            item: { ...emote, index: globalIndex, isChild: true },
                            top,
                        })
                    }
                    globalIndex++
                    top += itemHeight
                }
            }
        }

        return expandedItemList
    }

    const calculateTotalHeight = (list: EmoteCategory[]): number => {
        let totalHeight = 0
        for (let i = 0; i < list.length; i++) {
            totalHeight += itemHeight
            if (props.toggle || openedEmotes().has(i)) {
                totalHeight += list[i].emotes.length * itemHeight
            }
        }
        return totalHeight
    }

    const getFlattenedLength = (list: EmoteCategory[]): number => {
        let count = 0
        for (let i = 0; i < list.length; i++) {
            count++
            if (props.toggle || openedEmotes().has(i)) {
                count += list[i].emotes.length
            }
        }
        return count
    }

    const calculateVisibleRange = (scrollTop: number, list: EmoteCategory[]) => {
        const startIndex = Math.floor(scrollTop / itemHeight)
        const endIndex = Math.min(
            Math.ceil((scrollTop + viewportHeight) / itemHeight),
            getFlattenedLength(list)
        );
        return { startIndex, endIndex }
    }

    const toggleExpand = (index: number) => {
        setOpenedEmotes((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(index)) {
                newSet.delete(index)
            } else {
                newSet.add(index)
            }
            return newSet
        })
    }

    const handleScroll = (event: Event & { currentTarget: HTMLDivElement }) => {
        setScrollTop(event.currentTarget.scrollTop)
    }

    createEffect(on(
        () => [props.list, scrollTop(), openedEmotes()], 
        ([list, scrollTop]) => {
            if (Array.isArray(list)) {
                setVisibleItems(calculateVisibleItems(list, scrollTop as number))
            }
        },
        { defer: true }
    ))

    setVisibleItems(calculateVisibleItems(props.list, 0))

    return (
        <div
            class="flex flex-col gap-2"
            style={{
                height: ( visibleItems().length > 9 ? `${viewportHeight}px` : `${calculateTotalHeight(props.list)}px`),
                overflow: "auto",
                position: "relative",
            }}
            onScroll={handleScroll}
        >
            <div class="absolute w-full" style={{ height: `${calculateTotalHeight(props.list)}px` }}>
                <For each={visibleItems()}>
                    {({ category, item, top }) => (
                        <div
                            onClick={() => !("isChild" in item) && toggleExpand(item.index)}
                            style={{
                                position: "absolute",
                                top: `${top}px`,
                                height: `${itemHeight}px`,
                                'padding-left': "isChild" in item ? "3vh" : "0",
                                cursor: "isHeader" in item ? "pointer" : "default",
                                width: "100%",
                            }}
                        >
                            <Show
                                when={"isHeader" in item}
                                fallback={<Emote data={{ name: item.name, id: item.id } as EmoteType} category={category} />}
                            >
                                <button class="flex text-lg hover:bg-neutral-700/50 w-full items-center justify-between rounded-md px-3 py-4">
                                    <span class="font-medium">{item.name}</span>
                                    <RightIcon
                                        class={`h-5 w-5 transition-transform ${props.toggle || openedEmotes().has(item.index) ? "rotate-90" : ""}`}
                                    />
                                </button>
                            </Show>
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}

export default EmoteList