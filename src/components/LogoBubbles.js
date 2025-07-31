import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const logos = [
  "HubSpot", "Jotform", "Trello", "ClickUp", "webflow", "bubble",
  "Voiceflow", "zoom", "zendesk", "pingdom", "Canva", "I ❤️ IMG",
  "Landbot", "pendo"
];

const LogoBubbles = () => {
  const sceneRef = useRef(null);
  const hasFiredRef = useRef(false);
  const engineRef = useRef(Matter.Engine.create());
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });

  // Dynamically set dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth * 0.9, 900);
      const height = Math.min(window.innerHeight * 0.6, 500);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasFiredRef.current) {
          hasFiredRef.current = true;
          runMatter();
        }
      },
      { threshold: 0.5 }
    );

    if (sceneRef.current) observer.observe(sceneRef.current);

    return () => {
      if (sceneRef.current) observer.unobserve(sceneRef.current);
    };
  }, [dimensions]);

  const runMatter = () => {
    const engine = engineRef.current;
    const { width, height } = dimensions;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width,
        height,
        background: '#111',
        wireframes: false,
      },
    });

    Matter.Render.run(render);
    Matter.Runner.run(Matter.Runner.create(), engine);

    const ground = Matter.Bodies.rectangle(width / 2, height - 10, width, 20, {
      isStatic: true,
      render: { fillStyle: "#fff" },
    });

    const leftWall = Matter.Bodies.rectangle(-10, height / 2, 20, height, {
      isStatic: true,
      render: { visible: false },
    });

    const rightWall = Matter.Bodies.rectangle(width + 10, height / 2, 20, height, {
      isStatic: true,
      render: { visible: false },
    });

    const logoBodies = logos.map((text, i) => {
      const x = 50 + Math.random() * (width - 100);
      const y = -Math.random() * 200 - 100;
      const fill = i % 2 === 0 ? '#FF5A1F' : '#ffffff';
      const textColor = i % 2 === 0 ? '#fff' : '#000';

      const bodyWidth = Math.max(text.length * 8 + 30, 70); // Adjust size for small screens
      const body = Matter.Bodies.rectangle(x, y, bodyWidth, 40, {
        chamfer: { radius: 20 },
        restitution: 0.6,
        render: {
          fillStyle: fill,
          text: { content: text, color: textColor },
        },
      });

      Matter.Body.setVelocity(body, { x: 0, y: 2 });
      return body;
    });

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    render.mouse = mouse;

    Matter.Composite.add(engine.world, [
      ground,
      leftWall,
      rightWall,
      ...logoBodies,
      mouseConstraint,
    ]);

    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      logoBodies.forEach((body) => {
        const label = body.render.text?.content || "";
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = body.render.text?.color || "#000";
        ctx.textAlign = "center";
        ctx.fillText(label, body.position.x, body.position.y + 5);
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black md:p-10 p-2 sm:p-6">
      <p className='md:text-7xl text-2xl text-white font-bold text-center my-8 md:py-20'>
        Where does it come from?<br />Where does it come from?
      </p>

      <div
        style={{
          height: `${dimensions.height}px`,
          width: `${dimensions.width}px`,
          maxWidth: '100%',
          position: 'relative',
          backgroundColor: '#111',
        }}
      >
        {/* Overlaid Text */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            textAlign: 'center',
            color: '#ccc',
            fontSize: '14px',
            lineHeight: '1.5',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          We’re a great team of creatives with the strongest capabilities to help progressive fields
          achieve their goals. With the best talent on every project done successfully.
        </div>

        {/* Matter.js Canvas */}
        <div
          ref={sceneRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
};

export default LogoBubbles;
