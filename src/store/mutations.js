const mutations = {
    updateToken(state, obj) {
        state.token = obj.token
        console.log(state);
        console.log(obj);
    }
}
export default mutations
