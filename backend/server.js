const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// =============================
// 😊 EMOTION DETECTION ROUTE
// =============================
app.post("/detect-emotion", (req, res) => {
  console.log("📸 Emotion request received");

  const image = req.body.image;

  if (!image) {
    console.log("❌ No image received");
    return res.json({ emotion: "error" });
  }

  const base64Data = image.replace(/^data:image\/png;base64,/, "");

  fs.writeFileSync("temp.png", base64Data, "base64");
  console.log("✅ Image saved as temp.png");

  exec("python emotion.py temp.png", (error, stdout, stderr) => {
    if (error) {
      console.log("❌ ERROR:", error);
      return res.json({ emotion: "error" });
    }

    if (stderr) {
      console.log("⚠️ STDERR:", stderr);
    }

    const emotion = stdout.trim() || "error";
    console.log("✅ OUTPUT:", emotion);

    res.json({ emotion });
  });
});

// =============================
// 🎨 DRAWING DETECTION ROUTE (UPGRADED 🔥)
// =============================
app.post("/detect-drawing", (req, res) => {
  console.log("🎨 Drawing request received");

  const image = req.body.image;

  if (!image) {
    console.log("❌ No drawing received");
    return res.json({ result: "error" });
  }

  const base64Data = image.replace(/^data:image\/png;base64,/, "");

  fs.writeFileSync("drawing.png", base64Data, "base64");
  console.log("✅ Drawing saved as drawing.png");

  exec("python drawing_model.py drawing.png", (error, stdout, stderr) => {
    if (error) {
      console.log("❌ ERROR:", error);
      return res.json({ result: "error" });
    }

    if (stderr) {
      console.log("⚠️ STDERR:", stderr);
    }

    const shape = stdout.trim();

    if (!shape || shape === "Error") {
      return res.json({
        shape: "Unknown",
        feedback: "Try drawing a clearer shape."
      });
    }

    console.log("✅ DETECTED SHAPE:", shape);

    // 🔥 SMART FEEDBACK (AI-LIKE BEHAVIOR)
    let feedback = "";

    if (shape === "Circle") {
      feedback = "Great job! Try drawing a square next.";
    } else if (shape === "Square") {
      feedback = "Nice! Can you draw a triangle now?";
    } else if (shape === "Rectangle") {
      feedback = "Good work! Try drawing a circle.";
    } else if (shape === "Triangle") {
      feedback = "Awesome! Try combining shapes to draw a house.";
    } else {
      feedback = "Try drawing a clear shape like a circle or square.";
    }

    res.json({
      shape,
      feedback
    });
  });
});

// =============================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});