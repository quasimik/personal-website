'use strict'

const N_ROWS = 6
const N_COLS = 7

const boardPrototype = [
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
]

const checkPrototype = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
]

/** Class representing the game. */
class Game {

  /** Generate and return the initial game state. */
  start() {
    // let newBoard = Array.from({length: N_ROWS}, () => (
    //   Array.from({length: N_COLS}, () => 0)
    // ))
    let newBoard = boardPrototype.map((row) => row.slice())
    return new State([], newBoard, 1)
  }

  /** Return the current player's legal plays from given state. */
  legalPlays(state) {
    let legalPlays = []
    for (let col = 0; col < N_COLS; col++) {
      for (let row = N_ROWS - 1; row >= 0; row--) {
        if (state.board[row][col] == 0) {
          legalPlays.push(new Play(row, col))
          break
        }
      }
    }
    return legalPlays
  }

  /** Advance the given state and return it. */
  nextState(state, play) {
    let newHistory = state.playHistory.slice() // 1-deep copy
    newHistory.push(play)
    let newBoard = state.board.map((row) => row.slice())
    newBoard[play.row][play.col] = state.player
    let newPlayer = -state.player

    return new State(newHistory, newBoard, newPlayer)
  }

  /** Retreat the given state and return it. */
  prevState(state) {
    const play = state.playHistory.at(-1)
    const newHistory = state.playHistory.slice(0, -1) // 1-deep copy
    let newBoard = state.board.map((row) => row.slice())
    newBoard[play.row][play.col] = 0
    const newPlayer = -state.player

    return new State(newHistory, newBoard, newPlayer)
  }

  /** Return the winner of the game. */
  winner(state) {

    // if board is full, there's no winner
    if (!isNaN(state.board[0].reduce(
      (acc, cur) => cur == 0 ? NaN : acc + cur))
    ) return 0

    // one board for each possible winning run orientation
    let checkBoards = new Map()
    checkBoards.set("horiz", checkPrototype.map((row) => row.slice()))
    checkBoards.set("verti", checkPrototype.map((row) => row.slice()))
    checkBoards.set("ldiag", checkPrototype.map((row) => row.slice()))
    checkBoards.set("rdiag", checkPrototype.map((row) => row.slice()))

    // iterate over the board
    for (let row = 0; row < N_ROWS; row++) {
      for (let col = 0; col < N_COLS; col++) {
        let cell = state.board[row][col]
        for (let [key, val] of checkBoards) {

          // accumulator
          let acc
          switch(key) {
            case "horiz": acc = val[row + 1][col] // left
            break
            case "verti": acc = val[row][col + 1] // top
            break
            case "ldiag": acc = val[row][col] // top left
            break
            case "rdiag": acc = val[row][col + 2] // top right
            break
          }

          val[row + 1][col + 1] = cell
          if (cell < 0 && acc < 0 || cell > 0 && acc > 0) {
            val[row + 1][col + 1] += acc
          }
          if (val[row + 1][col + 1] == 4) return 1
          if (val[row + 1][col + 1] == -4) return -1
        }
      }
    }
    return null
  }

}

/** Class representing a game state. */
class State {

  constructor(playHistory, board, player) {
    this.playHistory = playHistory
    this.board = board
    this.player = player
  }

  isPlayer(player) {
    return (player === this.player)
  }

  hash() {
    return JSON.stringify(this.playHistory)
  }

  // Note: If hash uses board, multiple parents possible
}

/** Class representing a state transition. */
class Play {
  constructor(row, col) {
    this.row = row
    this.col = col
  }

  hash() {
    return this.row.toString() + "," + this.col.toString()
  }
}

module.exports = { Game, State, Play }
