import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FireTruckIcon from "@mui/icons-material/FireTruck";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Emergency Call</title>
        <meta name="description" content="Emergency call" />
        <link rel="icon" href="<AddIcCallIcon/>" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Emergency call</a>
        </h1>

        <p className={styles.description}>
          Select the emergency category from below
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>
              Medical <MedicalServicesIcon />
            </h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>
              Firetrack <FireTruckIcon />
            </h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>
              Police <LocalPoliceIcon />
            </h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Other &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
