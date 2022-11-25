import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <ToastContainer />
        </>
    );
}

export default MyApp;
