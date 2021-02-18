/**
 * Used to subscribe directly to the blocks of a given chain.
 * Contrasts to useChannel which offers a lightweight view into a chain
 * for reading limited data, and sending actions in.
 * useBlockstream pulls in the entire block, and fires every time a new block is created.
 * Uses the binary layer to access these blocks.
 */

const useBlockstream = (path, slice) => {
  // slice is some subpath in the state that we are interested in
}
