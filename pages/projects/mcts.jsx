import { useState } from 'react';
import Layout from '../../components/layout';
import styles from '/styles/mcts.module.css';

import { Game, Play } from '../../components/connect-four'
import { MonteCarlo } from '../../components/mcts'

const pageTitle = 'Monte Carlo Tree Search';

function renderCell(value) {
  switch (value) {
    case null:
      return '';
    case 1:
      return '🟡';
    case -1:
      return '🔴';
  }
}

function Cell({ value, handler }) {
  return (
    <button className={styles.cell} onClick={handler}>
      {renderCell(value)}
    </button>
  )
}

// function getHoverColor(legalPlays, hoverCol) {}

function ConnectFourMcts({ game, mcts }) {
  const [gameState, setGameState] = useState(() => {
    const initialState = game.start();
    return initialState;
  });
  const [gameWinner, setGameWinner] = useState(null);

  let handleCellClick = (i, j) => () => {
    if (gameWinner !== null) {
      return;
    }
    const play = new Play(i, j);
    const playHash = play.hash();
    const legalPlays = game.legalPlays(gameState);
    if (!legalPlays.some((legalPlay) => legalPlay.hash() === playHash)) {
      return;
    }
    const nextState = game.nextState(gameState, play);
    setGameState(nextState);
    const winner = game.winner(nextState);
    setGameWinner(winner);

    if (winner !== null) {
      return;
    }

    // MCTS runs and plays
    mcts.runSearch(nextState, 1);
    const mctsPlay = mcts.bestPlay(nextState, 'robust');
    const nextNextState = game.nextState(nextState, mctsPlay);
    const mctsWinner = game.winner(nextNextState);

    setGameState(nextNextState);
    setGameWinner(mctsWinner);
  }

  return (
    <>
      <div className={styles.connectFourGrid}>
        {gameState.board.map(( row, i ) => (
          row.map(( cell, j ) => (
            <Cell key={`${i},${j}`} value={cell} handler={handleCellClick(i, j)} />
          ))
        ))}
      </div>
      {gameWinner && <p>Winner: {renderCell(gameWinner)}</p>}
      <h3>Explanation</h3>
      <p>
        The algorithm runs for 1 second each move. I've heatmapped the cells to their next-move pick frequency,
        which is why the colors jump around after you pick a move. They don't reset completely after every move, as MCTS
        would have explored some grandchildren nodes of the child node which you just picked, before you picked it.
        Hover over the cells to see the cumulative simulated wins/picks.
      </p>
    </>
  )
}

export default function MctsProject() {
  const game = new Game();
  const mcts = new MonteCarlo(game);
  return (
    <Layout title={pageTitle}>
      <ConnectFourMcts game={game} mcts={mcts} />
      <h3>Background</h3>
      <p>
        Monte Carlo tree search (MCTS) is a general game-playing algorithm to find the best move from any given game
        state of any game.
      </p>
      <p>
        In 2017, I wrote a <a href="https://medium.com/@quasimik/monte-carlo-tree-search-applied-to-letterpress-34f41c86e238">
        Medium article</a> explaining the idea behind MCTS, and <a href="https://medium.com/@quasimik/implementing-monte-carlo-tree-search-in-node-js-5f07595104df">
        another one</a> going through a JavaScript implementation. MCTS is one of those deep algorithm things that benefit from high performance, which JS isn't known for. I reasoned at the time
        that, since I'm running the project on Node.js, Chrome's V8 engine would be good enough. While it did take me
        down a minor rabbit hole of JIT optimization, it ran quickly enough for the algorithm to self-play a tree that beats me
        convincingly at connect four.
      </p>
      <p>
        The real reason I did it in JS was because it was the language I was most comfortable with at the time. However,
        I did foresee that implementing it in JS would theoretically allow me to run an interactive MCTS demo
        client-side. Six years later in 2023, that is precisely what I have done here. The entire demo runs on your
        browser so I don't have to provision expensive compute for it.
      </p>
    </Layout>
  )
}