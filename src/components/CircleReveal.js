import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/DotExpand.css';

gsap.registerPlugin(ScrollTrigger);

const DotExpand = () => {
  const sectionRef = useRef(null);
  const dotRef = useRef(null);
  const greenRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
          pin: true,
        },
      });

      tl.fromTo(
        dotRef.current,
        { scale: 1 },
        { scale: 250, ease: 'power4.inOut' }
      );

      tl.to(greenRef.current, { opacity: 1, duration: 1 }, '+=0.1');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dot-section" ref={sectionRef}>
      <div className="image-wrapper">
        <img src="./i.png" alt="Background" className="bg-image" />
      </div>

      <div className="dot" ref={dotRef}></div>
      <div className="green-screen" ref={greenRef}>
        <h1 className='text-2xl font-bold text-center'>Lorem.<br />Ipsum.<br />Lorem.</h1>
        <p className='text-lg font-light text-center mt-4'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </p>
      </div>
    </section>
  );
};

export default DotExpand;
