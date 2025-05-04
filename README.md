
# Avante Maps 🌍  

**Avante Maps** is a business coverage and discovery web application designed to increase exposure for businesses accepting **Pi Coin**. By integrating with **OpenStreet Maps** and providing advanced search functionality, Avante Maps helps users discover businesses that support cryptocurrency payments while offering business owners valuable analytics and marketing opportunities.  

## 🚀 Features  

- **Business Discovery**: Easily find businesses that accept **Pi Coin** using an interactive map.  
- **Open Maps Integration**: Seamless navigation and location-based search functionality with **OpenStreet Maps**.  
- **Premium Business Subscriptions**: Unlock advanced features like business analytics, additional listing slots, and direct communication with the Avante Maps team.  
- **Free Marketing & Exposure**: Business owners benefit from increased visibility without additional costs.  
- **Future Business Card NFTs**: A unique digital identity solution for businesses in the Pi Network ecosystem.  
- **Enhanced UI/UX**: Optimized for different screen sizes to ensure a seamless experience.  

## 🔧 Technical Stack  

- **Frontend**: React, TypeScript, HTML, CSS, JavaScript  
- **Backend**: Node.js, Express  
- **Database**: Supabase  
- **Maps API**: OpenStreetMap  
- **Hosting**: Vercel, AWS, Firebase  

## 🌐 Environment Configuration

Avante Maps supports both Pi Network Testnet and Mainnet environments, allowing you to easily switch between the two.

### Switching Environments:
To configure your app for Testnet or Mainnet:

1. Open `src/config/environment.ts`
2. Locate the `PI_CONFIG` object.
3. Set `isTestnet` to:
   - `true` for Testnet environment.
   - `false` for Mainnet environment.

The `sandbox` option will automatically be adjusted based on this setting.

Example configuration:

```typescript
export const PI_CONFIG = {
  isTestnet: true, // Set to false for Mainnet
  sdkVersion: "2.0",
  sandbox: true, // Automatically true for Dev
};
```

---

## 📌 Roadmap  

### **2025 Goals**  
✔ Improve mobile responsiveness for different screen types.  
✔ Implement **Premium Subscriptions** for businesses.  
✔ Introduce **Business Analytics & Insights**.  
✔ Expand **marketing & outreach** for businesses listed on Avante Maps.  
✔ Develop **NFT-based business cards** for digital identity.  

## 📜 License  

This project is **open-source** under the [MIT License](LICENSE).  

## 💬 Get Involved  

👥 **Join the Community**  
- Follow our updates on [Pi Network forums](#) and social media.  
- Share your feedback and feature requests by opening an **issue**.  

🤝 **Contribute**  
- Fork this repository.  
- Create a new feature branch (`git checkout -b feature-branch`).  
- Commit your changes (`git commit -m "Add feature"`).  
- Push the branch (`git push origin feature-branch`).  
- Open a **Pull Request** for review.  

🚀 **Let's build the future of decentralized business discovery together!** 
