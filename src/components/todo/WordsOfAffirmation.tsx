import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AffirmationDisplay = () => {
  const [affirmation, setAffirmation] = useState('');
  const [gradientColors, setGradientColors] = useState(['#00ff87', '#60efff']);

  const fetchAffirmation = async () => {
    try {
      const response = await fetch('/api/affirmation');
      const data = await response.json();
      console.log('Affirmation data:', data);
      setAffirmation(data.affirmation);
    } catch (error) {
      console.error('Error fetching affirmation:', error);
    }
  };

  const generateRandomGradient = () => {
    const color1 = `hsl(${Math.random() * 360}, 100%, 75%)`;
    const color2 = `hsl(${Math.random() * 360}, 100%, 75%)`;
    setGradientColors([color1, color2]);
  };

  const handleClick = () => {
    fetchAffirmation();
    generateRandomGradient();
  };

  useEffect(() => {
    fetchAffirmation();
    generateRandomGradient();
  }, []);

  return (
    <motion.div 
      className="h-72 min-h-1/2 md:h-1/2 flex items-center justify-center p-8 cursor-pointer rounded-lg shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-800 shadow-text">
          {affirmation}
        </h1>
        <p className="text-xl text-gray-700 shadow-text">
          Click for a new affirmation
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AffirmationDisplay;