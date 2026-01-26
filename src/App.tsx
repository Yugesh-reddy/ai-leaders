
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Partners from './components/Partners';
import ApplicationForm from './components/ApplicationForm';
import Advisors from './components/Advisors';
import OpenSourceCallout from './components/OpenSourceCallout';
import FAQ from './components/FAQ';

function App() {
  return (
    <Layout>
      <Hero />
      <Partners />
      <About />
      <Advisors />
      <OpenSourceCallout />
      <FAQ />
      <ApplicationForm />
    </Layout>
  );
}

export default App;
