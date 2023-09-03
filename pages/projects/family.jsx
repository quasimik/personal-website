import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Layout from '../../components/layout';
import styles from '/styles/family.module.css';
import utilStyles from '/styles/utils.module.css';

const pageTitle = 'Family Tree Organizer';
const player = 'X';
const opponent = 'O';

const emojisTop = ['😀', '😃', '😄', '😁', '😆'];
const emojisBottom = ['🎉', '🎊', '🎈', '🎁', '🎂'];


const Badge = ({ emoji }) => (
  <div className={styles.badge}>
    {emoji}
  </div>
);

const FamilyCard = () => (
  <div className={styles.familyCard}>
    <div className={styles.familyCardRow}>
      {emojisTop.map((emoji, index) => (
        <Badge key={index} emoji={emoji} />
      ))}
    </div>
    <div className={styles.familyCardRowSide}>
      <Badge emoji='👈' />
      <div>
        <img src='image_url' alt='profile' className={styles.profileImage} />
        <p>Name</p>
      </div>
      <Badge emoji='👉' />
    </div>
    <div className={styles.familyCardRow}>
      {emojisBottom.map((emoji, index) => (
        <Badge key={index} emoji={emoji} />
      ))}
    </div>
  </div>
);

const LineBetween = ({ from, to }) => {
  const [fromPos, setFromPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [toPos, setToPos] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updatePositions = () => {
    setFromPos(from.current.getBoundingClientRect());
    setToPos(to.current.getBoundingClientRect());
  };

  useEffect(() => {
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [from, to]);

  const fromCenter = {
    x: fromPos.x + fromPos.width / 2,
    y: fromPos.y + fromPos.height / 2,
  };
  const toCenter = {
    x: toPos.x + toPos.width / 2,
    y: toPos.y + toPos.height / 2,
  };

  const fromRadius = Math.sqrt(fromPos.width ** 2 + fromPos.height ** 2) / 2;
  const toRadius = Math.sqrt(toPos.width ** 2 + toPos.height ** 2) / 2;

  const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x);

  const fromPerimeter = {
    x: fromCenter.x + fromRadius * Math.cos(angle),
    y: fromCenter.y + fromRadius * Math.sin(angle),
  };
  const toPerimeter = {
    x: toCenter.x - toRadius * Math.cos(angle),
    y: toCenter.y - toRadius * Math.sin(angle),
  };

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: "100%", height: "100%" }}>
      <circle cx={fromCenter.x} cy={fromCenter.y} r={fromRadius} fill="none" stroke="black" />
      <circle cx={toCenter.x} cy={toCenter.y} r={toRadius} fill="none" stroke="black" />
      <line 
        x1={fromPerimeter.x} 
        y1={fromPerimeter.y} 
        x2={toPerimeter.x} 
        y2={toPerimeter.y} 
        stroke="black" 
      />
    </svg>
  );
};

const ScrollSection = ({ items }) => (
  <div className={styles.scrollSection}>
    {items.map((item, index) => (
      <div key={index} className={styles.scrollItem}>
        {item}
      </div>
    ))}
  </div>
);

const MyComponent = ({ item }) => <div>{item}</div>;

function FamilyTreeOrganizer() {
  // const items1 = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  // const items2 = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];
  // const items3 = ['Item a', 'Item b', 'Item c', 'Item d', 'Item e'];
  // return (
  //   <div className="FamilyClass">
  //     <>
  //     {items1.map((item) => (
  //       <FamilyCard key={item} />
  //     ))}
  //     </>
  //     <ScrollSection items={items1} />
  //     <ScrollSection items={items2} />
  //     <ScrollSection items={items3} />
  //   </div>
  // );
  // return (
  //   <div>
  //     {items1.map((item, index) => (
  //       <MyComponent key={index} item={item} />
  //     ))}
  //   </div>
  // );

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
        <div ref={ref1} style={{height: "fit-content"}}>e1</div>
        <FamilyCard />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
        <div ref={ref2} style={{height: "fit-content"}}>e2</div>
        <FamilyCard />
      </div>
      <LineBetween from={ref1} to={ref2} />
    </>
  );
}

export default function FamilyProject() {
  return (
    <Layout title={pageTitle}>
      <FamilyTreeOrganizer />
      <h3>How to use</h3>
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