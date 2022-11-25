import Head from 'next/head';
import styles from '../styles/Home.module.css';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

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

                <div className={styles.grid}>
                    <a
                        href="http://localhost:3000/calls"
                        className={styles.card}
                    >
                        <h2>
                            Go to calls <MedicalServicesIcon />
                        </h2>
                    </a>
                </div>
            </main>
        </div>
    );
}
