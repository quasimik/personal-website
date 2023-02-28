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
    let totalWins = 0;
    for (const childNode of mctsStats.children) {
      totalWins += childNode.n_wins;
      if (childNode.play.row === i && childNode.play.col === j) {
        heat = childNode.n_wins;
      }
    }
    heat /= totalWins;
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
              <span>AutoPlay</span>
            ) : waitForInput ? (
              <span className={styles.textButton} onClick={handleAutoClick}>AutoPlay</span>
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
  )
}

export default function MctsProject() {
  return (
    <Layout title={pageTitle}>
      <ConnectFourMcts />
      <h3>How to play</h3>
      <p>
        To begin, click on any bottom-most slot in any column.
      </p>
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
        After every move, Your AI opponent will think and play a counter-move automatically, and you take turns until
        someone wins. You can auto-play moves, and you can undo your moves to try playing different ones.
      </p>
      <h3>What is this?</h3>
      <p>
        This is a technical demo of a game-playing algorithm called Monte Carlo tree search (MCTS). I've chosen to use
        Connect Four as the game, although MCTS is a general algorithm that can be applied to any game. The AI opponent {opponent} here
        "thinks" by running MCTS search for 1 second before making each move. For every move, the valid next-move cells
        are heatmapped to their simulated win frequency, which intuitively corresponds to how good MCTS estimates that
        move to be.
      </p>
      <p>
        <b><tt>AutoPlay</tt></b> uses MCTS to pick a move for yourself {player}. Because <tt>AutoPlay</tt> and opponent
        moves share one MCTS instance, you benefit from previous searches on ancestor nodes originally performed for the
        benefit of the opponent {opponent}. Similarly, it will benefit descendant nodes regardless of the player.
      </p>
      <p>
        <b><tt>Undo</tt></b> moves 2 states back so you can try playing different moves. I don't re-run MCTS search on
        previously reached states, so every state only gets 1 second of compute even if you reach them multiple times
        using undos. One annoying thing is that because I don't track updates to the MCTS statistics (I only track
        updates to the game state), the statistics accumulate to shared ancestors with undos. This manifests as super
        red heatmap cells if you undo to some ancestor after playing a bunch of its descendants.

      </p>
      {/*<p>Hover over the cells to see the cumulative simulated wins/picks.</p>*/}
      <h3>Background</h3>
      <p>
        Monte Carlo tree search (MCTS) is a general game-playing algorithm to find the best move from any given game
        state of any game.
      </p>
      <p>
        In 2017, I wrote a <a href="https://medium.com/@quasimik/monte-carlo-tree-search-applied-to-letterpress-34f41c86e238">
        Medium article</a> explaining the idea behind MCTS, and <a href="https://medium.com/@quasimik/implementing-monte-carlo-tree-search-in-node-js-5f07595104df">
        another one</a> going through a JavaScript implementation. For a deeper dive into MCTS, please read those
        articles.
      </p>
      <p>
        MCTS is one of those deep algorithm things that benefit from high performance, which JS isn't known for. I
        reasoned at the time that, since I'm running the project on Node.js, Chrome's V8 JS engine would give me good
        enough performance. While it did take me down a minor rabbit hole of JIT optimization, it actually ran well
        enough for the algorithm to self-play a tree that beats me convincingly at connect four.
      </p>
      <p>
        The real reason I did it in JS was because it was the language I was most comfortable with at the time. However,
        I did foresee that implementing it in JS would theoretically allow me to run an interactive MCTS demo
        client-side, but I was too lazy to deal with setting up a whole web stack just to showcase it. Six years later
        in 2023, the React ecosystem has developed to the point of extremely mature and well-designed frameworks and
        deployment solutions (i.e. Next.js + Vercel), and they take care of enough annoying details that I managed to
        implement this in 2 days. The entire demo runs on your browser.
      </p>
    </Layout>
  )
}