## ImmersivΞ: WebXR Digital Art Gallery

*Sui Overflow 2025 Hackathon Project*

**Live Demo:** [https://www.immersiv3.tech/](https://www.immersiv3.tech/)

---

### Key Features
* **Immersive XR Mode:** Functional AR for 3D NFT viewing and a simple VR mode.
* **Responsive UI/UX:** Optimized for mobile and various screen sizes.
* **Intuitive 3D Display:** Showcasing `.glb` artworks with engaging visuals.

---

### Development Status
* **Frontend:** Approximately 90-95% complete, demo-ready with UI/UX and WebXR functionality.
* **Backend & Blockchain:**
    * **Sui Wallet Integration:** Functions well for seamless user authentication and transactions.
    * **NFT Minting:** Smart contract calls are integrated, allowing users to mint NFTs directly.
    * **Smart Contract:** A basic Sui Move contract for NFT minting has been deployed and tested.
    * *The backend is still under continuous development, and we plan to implement further enhancements after this hackathon.*

---

### Tech Stack
* **Frontend:**
    * **XR / 3D:** Three.js, WebXR, WebGL
    * **Core:** React, Tailwind CSS, GSAP, Vite, TypeScript
    * **Sui Integration:** `@mysten/dapp-kit`, `@mysten/sui`
* **Smart Contract (Sui Move):** Basic **NFT minting smart contract** for a limited supply (1111 pieces).

---

### Local Development
1.  **Clone:** `git clone "https://github.com/artitaya-git/immersiv3.git" && cd immersiv3`
2.  **Install:** `npm install`
3.  **Run Dev Server:** `npm run dev`

*Optional for Sui Move Contract:*
* **Build:** `sui move build`
* **Test:** `sui move test`

---

### Developer
* [https://github.com/artitaya-git](https://github.com/artitaya-git) - Self-taught coder. Focused on frontend, UI/UX, and WebXR.