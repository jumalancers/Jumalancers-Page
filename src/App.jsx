import Navbar from "./sections/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import Problem from "./sections/Problem.jsx";
import Solution from "./sections/Solution.jsx";
import Process from "./sections/Process.jsx";
import Portafolio from "./sections/Portafolio.jsx";
import WhyChooserUs from "./sections/why.jsx";
import Quote from "./sections/Quote.jsx";
import Plans from "./sections/Plans.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import BackgroundDots from "./components/BackgroundDots.jsx";

function App() {
  return (
    <>
      <BackgroundDots baseAlpha={0.04} hoverAlpha={0.2} spacing={24} />
      <Navbar/>
      <Hero/>
      <Problem/>
      <Solution/>
      <Process/>
      <Portafolio/>
      <WhyChooserUs/>
      <Quote/>
      <Plans/>
      <Contact/>
      <Footer/>
    </>
  )
}

export default App
