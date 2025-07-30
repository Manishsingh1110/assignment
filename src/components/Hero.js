import React, { useEffect, useRef, useState } from 'react';
import '../css/Hero.css';

const Hero = () => {
  const expandableRef = useRef(null);
  const outerDivRef = useRef(null);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!outerDivRef.current) return;

      const outerTop = outerDivRef.current.getBoundingClientRect().top;
      const scrollY = Math.max(0, -outerTop); // How much of .outerdiv has scrolled

      const scale = Math.max(1, 5 - 0.01 * scrollY); // Shrinks from 5 to 1
      const opacity = Math.min(1, 1.5 * scrollY / 1000); // Fades in

      //  
      if (expandableRef.current) {
        expandableRef.current.style.transform = `scale(${scale})`;
        expandableRef.current.style.opacity = opacity;
      }

      if (scale <= 1.05 && opacity >= 0.9) {
        setShowCards(true);
      } else {
        setShowCards(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
    <div className='outerdiv' ref={outerDivRef}>
      <div id="expandable" ref={expandableRef}>Kill <br/> the PDF</div>     
<div class={`cards-container ${showCards ? 'visible' : ''}`}>
  <div class="cards card-1">
    <h3>Lorem Ipsum</h3>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
  </div>
  <div class="cards card-2">
    <h3>Lorem Ipsum</h3>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
  </div>
</div>
    </div>
    
      </>
  );
};

export default Hero;
