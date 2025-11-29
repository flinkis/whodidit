# Vision: A Carnivore Did It! - Final Polish

Since I cannot currently generate a visual sketch due to system limits, this document outlines the visual and atmospheric target for the "finished" game.

## Aesthetic: Neon Noir / Cyberpunk Detective
The game should feel like you are standing in front of a high-tech holographic case board in a dimly lit, rain-slicked detective office of the future.

### Visual Pillars
1.  **Atmosphere**:
    *   **Background**: Deep, dark blues and purples (#050511). Subtle animated rain effects or drifting fog in the background to make the scene feel "alive".
    *   **Lighting**: Everything should glow. The UI elements aren't just flat boxes; they are projections of light. Use `box-shadow` and `text-shadow` heavily to create bloom effects.
    *   **Glassmorphism**: Panels should look like frosted glass (acrylic) with a slight blur (`backdrop-filter: blur(10px)`), reflecting the neon lights of the city behind them.

2.  **The "Board" (Game Screen)**:
    *   **Circular Lineup**: The current circular layout is perfect. It represents a digital "roundtable" of suspects.
    *   **Holographic Connections**: Instead of simple lines, use glowing "laser" lines to connect statements to suspects. When a player hovers over a statement, the line should pulse or brighten.
    *   **Suspect Projections**: The character images should look like holographic mugshots. Maybe add a subtle "scanline" overlay or a slight chromatic aberration effect to reinforce the digital nature.

3.  **UI Elements**:
    *   **Typography**: The font 'Outfit' is great. For headers, we can go bolder. For data (height, diet), use a monospace font like 'Fira Code' or 'Courier New' to look like raw data.
    *   **Buttons**: The "Submit" button should be the heart of the UI. It should pulse slowly like a heartbeat. When clicked, it should explode with light (particles).
    *   **Feedback**:
        *   **Success**: The screen should flash green/gold, and "CASE CLOSED" should stamp onto the screen with a heavy mechanical sound.
        *   **Failure**: The screen glitches (RGB shift), turns red, and "SUSPECT ESCAPED" appears.

## Future Features for "Finished" Look
1.  **Narrative Layer**:
    *   A "Case File" folder icon that opens a modal with the backstory of the crime.
    *   Animated typing text for the statements, as if they are being transcribed in real-time.

2.  **Juice & Polish**:
    *   **Sound Design**: Ambient rain noise, synth-wave background drone, high-tech chirps for button hovers, and a satisfying "thud" when selecting a suspect.
    *   **Transitions**: Smooth layout animations (using `framer-motion`) when switching between the menu and game. The suspects shouldn't just appear; they should "rez" in.

3.  **Character Art**:
    *   The current "mugshots" are a great start. The final version would have animated idle states (breathing, blinking, looking around) to make the suspects feel guilty or nervous.

## Technical Implementation Steps
- [ ] Add `framer-motion` for entrance/exit animations.
- [ ] Implement a "scanline" CSS overlay for the suspect images.
- [ ] Add a particle system for the "Submit" button click.
- [ ] Integrate a sound library (e.g., `use-sound`) for UI feedback.
