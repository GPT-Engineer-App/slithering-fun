import React, { useState, useEffect, useRef } from "react";
import { Container, Text, VStack, Box, Button } from "@chakra-ui/react";

const Index = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(10, 0, 0, 10, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "green";
    snake.forEach(({ x, y }) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, 1, 1);
  }, [snake, food, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const newSnake = [...prev];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

        if (head.x === food.x && head.y === food.y) {
          setFood({ x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) });
        } else {
          newSnake.pop();
        }

        if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 30 || newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        newSnake.unshift(head);
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Snake Game</Text>
        <Box position="relative">
          <canvas ref={canvasRef} width="300" height="300" style={{ border: "1px solid black" }} />
          {gameOver && (
            <Box position="absolute" top="0" left="0" width="100%" height="100%" display="flex" justifyContent="center" alignItems="center" backgroundColor="rgba(255, 255, 255, 0.8)">
              <Text fontSize="2xl" color="red">Game Over</Text>
            </Box>
          )}
        </Box>
        <Button onClick={resetGame} colorScheme="teal">Restart Game</Button>
      </VStack>
    </Container>
  );
};

export default Index;