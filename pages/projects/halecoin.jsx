import Layout from '../../components/layout';
import styles from '/styles/mcts.module.css';

const pageTitle = 'HaleCoin';

export default function HaleCoinProject() {
  return (
    <Layout title={pageTitle}>
      <p>
        In 2018, I entered and won HackUCI (hosted by the University of California, Irvine) with <a href="https://devpost.com/software/halecoin">HaleCoin</a>. The idea
        was to incentivize people to do pushups by giving them money. The way we verify that they are doing pushups is
        by using <a href="https://github.com/CMU-Perceptual-Computing-Lab/openpose">OpenPose</a>, which is a computer
        vision library by CMU that detects human posture. The way we give money is by giving them "HaleCoins", which is
        either an Ethereum clone or sidechain (I'm not entirely sure). My friend <a href="https://nathanaelsee.com/">Nathanael See</a> did
        the logic for installing and running OpenPose on a webcam stream, teammates Matthew and William did the
        Ethereum side of things, and I worked on architecture, networking, and integration.
      </p>
      <p>
        In the end, though, we pumped it full of memes (every time you do a pushup, DJ Khaled tells you to do
        "another one!"); and our incredible showman-teammate Zen just charmed the judges into giving us the gold.
      </p>
    </Layout>
  )
}