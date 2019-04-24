import { NEXT_TORRENT_KEY_USED, ADD_TORRENT } from "./store/mutation-types";
import { START_DOWNLOAD_GAME } from "./store/actions-types";

export async function restoreStoreFromSavedUserState(store, state) {
  // Improve Dev Exp: Restore last page you worked in
  // if (IS_DEV && state.vue && state.vue.route) {
  //   app.$router.push(state.vue.route);
  // }
  const { torrents = [] } = state;
  const { rootState: storeState, dispatch, getters } = store;
  console.log('restoreStoreFromSavedUserState() main renderer state', state);
  console.log(`isAuthenticated ${getters['IS_LOGGED_IN']}`);
  // if (getters['IS_LOGGED_IN']) {
  // const user = getters[USER];
  // console.log(`user ${user}`);
  const promises = [];
  torrents.forEach((t) => {
    if (!t || !t.infoHash) {
      console.warn('Badly saved torrent', t);
      return;
    }
    const torrentKey = storeState.nextTorrentKey;
    dispatch(NEXT_TORRENT_KEY_USED);
    const originalState = t.state;
    const torrent = {
      ...t,
      torrentKey,
      // Force pause
      state: 'paused',
    };
    console.log('restoring torrent state', torrent, {
      dwnld: t.downloaded,
      notpaused: originalState !== 'paused',
      start: t.downloaded || originalState !== 'paused',
    });
    promises.push(dispatch({
      type: ADD_TORRENT,
      payload: torrent,
    }));
    if (t.downloaded || originalState !== 'paused') {
      console.log('dispatching start download', torrent.gameId);
      // seed downloaded or download not paused
      promises.push(dispatch(START_DOWNLOAD_GAME, { gameId: torrent.gameId }));
    }
  });
  // }
  return Promise.all(promises);
}
