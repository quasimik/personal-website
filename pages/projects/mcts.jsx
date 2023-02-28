import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PulseLoader } from 'react-spinners';
import Layout from '../../components/layout';
import styles from '/styles/mcts.module.css';
import utilStyles from '/styles/utils.module.css';

import { Game, Play } from '../../components/connect-four';
import { MonteCarlo } from '../../components/mcts';

const pageTitle = 'Monte Carlo Tree Search';
const player = '🟡';
const opponent = '🔴';

function renderCell(value) {
  switch (value) {
    case null:
      return '';
    case 1:
      return player;
    case -1:
      return opponent;
  }
}

function getHeatmapColor(i, j, mctsStats) {
  let heat = 0;
  if (mctsStats !== null) {
    for (const childNode of mctsStats.children) {
      if (childNode.play.row === i && childNode.play.col === j) {
        heat = childNode.n_plays / mctsStats.n_plays
      }
    }
  }
  return `rgb(255,0,0,${heat})`
}

function Cell({ value, handler, color }) {
  return (
    <button className={styles.cell} onClick={handler} style={{ backgroundColor: color }}>
      {renderCell(value)}
    </button>
  )
}

// function getHoverColor(legalPlays, hoverCol) {}

function ConnectFourMcts() {
  const game = useRef(null);
  if (game.current === null) {
    game.current = new Game();
  }
  const reachedStates = useRef(null);
  if (reachedStates.current === null) {
    reachedStates.current = new Set();
  }
  const mcts = useRef(null);
  if (mcts.current === null) {
    mcts.current = new MonteCarlo(game.current);
  }
  const [gameState, setGameState] = useState(() => {
    const initialState = game.current.start();
    return initialState;
  });
  const [mctsStats, setMctsStats] = useState(null);
  const [gameWinner, setGameWinner] = useState(null);
  const [waitForInput, setWaitForInput] = useState(true);

  /**
   * Autoplay
   */
  useEffect(() => {
    if (gameWinner !== null || waitForInput) {
      return;
    }
    setTimeout(() => {
      if (!reachedStates.current.has(gameState.hash())) {
        mcts.current.runSearch(gameState, 1);
        reachedStates.current.add(gameState.hash());
      }
      const nextStats = mcts.current.getStats(gameState);
      setMctsStats(nextStats);

      const play = mcts.current.bestPlay(gameState, 'max');

      const nextState = game.current.nextState(gameState, play);
      const nextWinner = game.current.winner(nextState);
      setGameState(nextState);
      setGameWinner(nextWinner);
      setWaitForInput(nextState.player === 1);
    }, 100);
  }, [waitForInput, gameWinner, gameState]);

  const handleCellClick = (i, j) => () => {
    if (!(gameWinner === null && gameState.player === 1)) {
      return;
    }

    const play = new Play(i, j);
    const playHash = play.hash();
    const legalPlays = game.current.legalPlays(gameState);
    if (!legalPlays.some((legalPlay) => legalPlay.hash() === playHash)) {
      return;
    }
    const nextState = game.current.nextState(gameState, play);
    const nextWinner = game.current.winner(nextState);
    setGameState(nextState);
    setGameWinner(nextWinner);
    setWaitForInput(false);
  }

  const handleUndoClick = () => {
    const prevState = game.current.prevState(gameState);
    const prevPrevState = game.current.prevState(prevState);
    setGameState(prevPrevState);
    const prevPrevWinner = game.current.winner(prevPrevState);
    setGameWinner(prevPrevWinner);
    if (prevPrevState.playHistory.length > 0) {
      const prevPrevPrevState = game.current.prevState(prevPrevState);
      const prevStats = mcts.current.getStats(prevPrevPrevState);
      setMctsStats(prevStats);
    }
    else {
      setMctsStats(null);
    }
  }

  const handleResetClick = () => {
    game.current = new Game();
    reachedStates.current = new Set();
    mcts.current = new MonteCarlo(game.current);
    const initialState = game.current.start();
    setGameState(initialState);
    setMctsStats(null);
    setGameWinner(null);
    setWaitForInput(true);
  }

  const handleAutoClick = () => {
    setWaitForInput(false);
  }

  return (
    <>
      <div className={styles.connectFourContainer}>
        <div className={styles.connectFourLeft}>
          <div className={styles.connectFourGrid}>
            {gameState.board.map(( row, i ) => (
              row.map(( cell, j ) => (
                <Cell
                  key={`${i},${j}`}
                  value={cell}
                  handler={handleCellClick(i, j)}
                  color={getHeatmapColor(i, j, mctsStats)}
                />
              ))
            ))}
          </div>
          <div className={styles.textArea}>
            <p className={styles.textControls}>
              {gameWinner || waitForInput && reachedStates.current.size > 0 ? (
                <span className={styles.textButton} onClick={handleResetClick}>Reset</span>
              ) : (
                <span>Reset</span>
              )}
              &ensp;•&ensp;
              {gameWinner || waitForInput && gameState.playHistory.length > 0 ? (
                <span className={styles.textButton} onClick={handleUndoClick}>Undo</span>
              ) : (
                <span>Undo</span>
              )}
              &ensp;•&ensp;
              {gameWinner || gameState.player === -1 ? (
                <span>Auto</span>
              ) : waitForInput ? (
                <span className={styles.textButton} onClick={handleAutoClick}>Auto</span>
              ) : (
                <PulseLoader size='0.4em' />
              )}
            </p>
            {gameWinner && <p>Winner: {renderCell(gameWinner)}</p>}
          </div>
        </div>
        <div className={styles.connectFourRight}>
          <h4>State MCTS statistics:</h4>
          {!gameWinner && gameState.player === -1 ? (
            <PulseLoader />
          ) : (
            mctsStats && (
              <>
                <p>Total plays: {mctsStats.n_plays}</p>
                <p>{player} wins: {mctsStats.n_wins}</p>
                <p>{opponent} wins: {mctsStats.children.reduce((acc, child) => acc + child.n_wins, 0)}</p>
              </>
            )
          )}
        </div>
      </div>
      <h3>Instructions</h3>
      <p>
        This is Connect Four, a game where you and an opponent take turns placing coins down in slots, and the first to
        form a run of 4 coins wins. The 4 coins in a winning run can be horizontal, vertical, or diagonal. The coins
        fall down each column due to gravity, so you can only place them on the bottom-most empty slot in each column.
        You are yellow {player} and your AI opponent is red {opponent}.
      </p>
      <div className={utilStyles.centeredContainer}>
        <Image
          src="/images/connect-four.webp"
          height={384}
          width={384}
          alt=""
        />
      </div>
      <p>
        To begin, click on any bottom-most slot in any column. Your AI opponent will think and play a counter-move
        automatically. You take turns until someone wins, and you can undo your moves to try playing different ones.
      </p>
      <h3>Technical details</h3>
      <p>
        The algorithm runs for 1 second each move. I've heatmapped the cells to their next-move pick frequency,
        which is why the colors jump around after you pick a move. They don't reset completely after every move, as MCTS
        would have explored some grandchildren nodes of the child node which you just picked, before you picked it.
      </p>
      <p>
        Undo moves 2 states back so you can try playing different moves. I track previously reached states and don't
        run MCTS search on these, so every state only gets 1 second of compute even if you reach them multiple times
        using undos. One annoying thing is that because I don't track updates to the MCTS statistics (I only track
        updates to the game state), the statistics accumulate to shared ancestors with undos. This manifests as super
        red heatmap cells after you undo to some ancestor after playing a bunch of its descendants.
      </p>
      {/*<p>Hover over the cells to see the cumulative simulated wins/picks.</p>*/}
    </>
  )
}

export default function MctsProject() {
  return (
    <Layout title={pageTitle}>
      <ConnectFourMcts />
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