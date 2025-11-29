import { Animal } from '../types';

export const ANIMALS: Record<number, Animal> = {
    1: { id: 1, name: "Panther", height: 178, diet: "carnivore", image: "/assets/panther.png", color: "#E91E63" },
    2: { id: 2, name: "Peacock", height: 169, diet: "herbivore", image: "/assets/peacock.png", color: "#2196F3" },
    3: { id: 3, name: "Shark", height: 192, diet: "carnivore", image: "/assets/shark.png", color: "#607D8B" },
    4: { id: 4, name: "Iguana", height: 162, diet: "herbivore", image: "/assets/iguana.png", color: "#4CAF50" },
    5: { id: 5, name: "Bear", height: 184, diet: "carnivore", image: "/assets/bear.png", color: "#795548" },
    6: { id: 6, name: "Horse", height: 200, diet: "herbivore", image: "/assets/horse.png", color: "#FF9800" },
    7: { id: 7, name: "Dog", height: 173, diet: "carnivore", image: "/assets/dog.png", color: "#FFC107" }
};

export const ANIMAL_IDS: number[] = [1, 2, 3, 4, 5, 6, 7];
