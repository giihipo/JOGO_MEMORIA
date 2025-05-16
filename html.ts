import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const images = [
  "🍎", "🍌", "🍇", "🍓", "🍍", "🥝"
];

const shuffleArray = (array) => {
  return [...array, ...array]
    .sort(() => Math.random() - 0.5)
    .map((item, index) => ({ id: index, content: item, flipped: false, matched: false }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const newCards = shuffleArray(images);
    setCards(newCards);
    setGameWon(false);
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (card) => {
    if (isLocked || card.flipped || card.matched) return;

    const newFlipped = [...flippedCards, card];
    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setTimeout(() => {
        const [first, second] = newFlipped;
        let updatedCards;
        if (first.content === second.content) {
          updatedCards = newCards.map((c) =>
            c.content === first.content ? { ...c, matched: true } : c
          );
        } else {
          updatedCards = newCards.map((c) =>
            c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c
          );
        }
        setCards(updatedCards);
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 font-sans flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Jogo da Memória</h1>
      <div className="grid grid-cols-4 gap-4 max-w-xl">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`transition-all duration-300 ease-in-out h-24 flex items-center justify-center rounded-2xl shadow-xl ${card.flipped || card.matched ? "bg-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              <CardContent className="text-3xl">
                {(card.flipped || card.matched) ? card.content : "❓"}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {gameWon && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-white rounded-xl shadow-lg text-green-600 font-semibold text-xl"
        >
          🎉 Parabéns! Você venceu o jogo!
        </motion.div>
      )}
    </div>
  );
}
