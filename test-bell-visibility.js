// Quick test to verify notifications are working
// Open browser console (F12) and paste this code when on the investor dashboard

console.log("=== NOTIFICATION BELL DEBUG ===");
console.log("Current URL:", window.location.href);
console.log("Bell icon should be visible if you're on /dashboard/investor");

// Check if React component has loaded
setTimeout(() => {
  const bellButton = document.querySelector('[aria-label="Notifications"]');
  if (bellButton) {
    console.log("✅ Bell button found in DOM!");
    console.log("Bell button element:", bellButton);
    console.log("Bell is visible:", bellButton.offsetParent !== null);
    
    // Highlight the bell
    bellButton.style.border = "3px solid red";
    bellButton.style.backgroundColor = "yellow";
    console.log("🔔 Bell should now be highlighted with red border and yellow background");
  } else {
    console.error("❌ Bell button NOT found in DOM");
    console.log("This means either:");
    console.log("1. You're not on the investor dashboard");
    console.log("2. The component hasn't rendered yet");
    console.log("3. There's a JavaScript error preventing rendering");
  }
}, 2000); // Wait 2 seconds for page to load
