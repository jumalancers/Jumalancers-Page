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

function App() {
  return (
    <>
      <BackgroundDots baseAlpha={0.04} hoverAlpha={0.2} spacing={24} />
      <Navbar />
      <main id="main">
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
      </main>
      <Footer />
    </>
  );
}

export default App;
