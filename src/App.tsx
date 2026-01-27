
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Partners from './components/Partners';
import ApplicationForm from './components/ApplicationForm';
import Advisors from './components/Advisors';
import OpenSourceCallout from './components/OpenSourceCallout';
import FAQ from './components/FAQ';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

function App() {
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey || ''}>
      <Layout>
        <Hero />
        <Partners />
        <About />
        <Advisors />
        <OpenSourceCallout />
        <FAQ />
        <ApplicationForm />
      </Layout>
    </GoogleReCaptchaProvider>
  );
}

export default App;
