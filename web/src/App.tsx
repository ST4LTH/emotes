import { Show, type Component } from 'solid-js'
import EmoteMenu from './layout/emoteMenu';
import EmoteStore, { setEmoteStore } from './store';
import { useNuiEvent } from './hooks/useNuiEvent';

const App: Component = () => {
  useNuiEvent('toggle', (toggle: boolean) => {
    setEmoteStore('open', toggle);
  })

  return <>
    <Show when={EmoteStore.open}>
      <EmoteMenu />
    </Show>
  </>
}

export default App;
