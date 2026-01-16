
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Partners from './components/Partners';
import ApplicationForm from './components/ApplicationForm';
import Team from './components/Team';
import FAQ from './components/FAQ';

function App() {
  return (
    <Layout>
      <Hero />
      <Partners />
      <About />
      <Team />
      <FAQ />
      <ApplicationForm />
    </Layout>
  );
}

export default App;
