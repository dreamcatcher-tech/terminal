const reducer = (state = {}, action) => {
  console.log(`action: %O`, action)
  return state
}

module.exports = {
  basic: { reducer },
}
