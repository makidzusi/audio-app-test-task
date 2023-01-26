import {createStore} from "vuex";

const BASE_URL = import.meta.env.VITE_APP_BASE_API_URL

const store = createStore({
    state: {
        activeTrack: null,
        activeTrackElapsedTime: '0',
        isTrackPaused: true,
    },
    getters: {
        activeTrack: state => state.activeTrack,
        elapsedTrackTime: state => state.activeTrackElapsedTime,
        isTrackPaused: state => state.isTrackPaused
    },

    actions: {
        setActiveTrack({commit}, track) {
            commit('setActiveTrack', track);
        },
        setTrackElapsesTime({commit}, time: string) {
            commit('setElapsesTrackTime', time)
        },
        setTrackPauseState({commit}, state) {
            commit('setTrackPauseState', state)
        },
        getTracks() {
            return new Promise((resolve, reject) => {
                fetch(`${BASE_URL}/api/tracks`).then((res) => {
                    resolve(res.json())
                }).catch(err => {
                    reject(err)
                })
            })
        },
        saveTrack(_, data: FormData) {
            return new Promise((resolve, reject) => {
                fetch(`${BASE_URL}/api/save`, {
                    method: 'POST',
                    body: data
                }).then(res => {
                    resolve(res.json())
                }).catch(err => {
                    reject(err)
                })
            })
        }
    },

    mutations: {
        setActiveTrack(state, track) {
            state.activeTrack = track;
        },
        setElapsesTrackTime(state, time: string) {
            state.activeTrackElapsedTime = time
        },
        setTrackPauseState(state, _state) {
            state.isTrackPaused = _state;
        }
    }
});

export default store;
