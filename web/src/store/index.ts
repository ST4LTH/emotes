import { createStore } from "solid-js/store"
import emotesData from "./emotes.json"
import { post } from "../utils/post";

export type EmoteType = {
    name: string;
    id: string;
}

export type EmoteCategory = {
    name: string;
    emotes: EmoteType[];
}

export type keybindType = { 
    id: string, 
    category: string, 
    key: string 
}

export type keybindListType = { [key: string]: keybindType|undefined }


export type EmoteStore = {
    emotes: EmoteCategory[],
    keybindEmotes: keybindListType,
    currentKeybind: keybindType|null,
    open: boolean
}

export const [EmoteStore, setEmoteStore] = createStore<EmoteStore>({
    emotes: emotesData,
    keybindEmotes: {},
    currentKeybind: null,
    open: false
})

export const emoteActions = {
    isKeybind: (emoteName: string): boolean => {
        return EmoteStore.keybindEmotes[emoteName] ? true : false;
    },

    getKeybind: (emoteName: string): keybindType|undefined => {
        return EmoteStore.keybindEmotes[emoteName];
    },

    setKeybind: (emoteName: string, category: string, key: string) => {
        if (EmoteStore.keybindEmotes[emoteName]) return;

        post('newKeybind', { id: emoteName, key, category }, () => {
            setEmoteStore('currentKeybind', null)
            setEmoteStore("keybindEmotes", emoteName, { id: emoteName, key, category })
        })
    },

    removeKeybind: (emoteName: string) => {
        if (!EmoteStore.keybindEmotes[emoteName]) return;
    
        post('removeKeybind', emoteName, () => {
            setEmoteStore("keybindEmotes", emoteName, undefined);
        });
    },
}

export default EmoteStore;