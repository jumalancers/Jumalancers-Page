import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import ClientsStrip from "./sections/ClientsStrip.jsx";
import Services from "./sections/Services.jsx";
import Portafolio from "./sections/Portafolio.jsx";
import Process from "./sections/Process.jsx";
import WhyChooserUs from "./sections/why.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import Plans from "./sections/Plans.jsx";
import Quote from "./sections/Quote.jsx";
import Faq from "./sections/Faq.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import BackgroundDots from "./components/BackgroundDots.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import ProcessPage from "./pages/ProcessPage.jsx";
import { useLang } from "./i18n.jsx";
import { getPage } from "./routes.js";

function Home() {
  return (
    <>
      <Hero />
      <ClientsStrip />
      <Services />
      <Portafolio />
      <Process />
      <WhyChooserUs />
      <Testimonials />
      <Plans />
      <Quote />
      <Faq />
      <Contact />
    </>
  );
}

function App() {
  const { page: key } = useLang();
  const page = getPage(key);
  return (
    <>
      <BackgroundDots baseAlpha={0.04} hoverAlpha={0.2} spacing={24} />
      <Navbar />
      <main id="main">
        {page.type === "service" ? (
          <ServicePage id={page.key} />
        ) : page.type === "project" ? (
          <ProjectPage id={page.id} />
        ) : page.type === "process" ? (
          <ProcessPage />
        ) : (
          <Home />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
