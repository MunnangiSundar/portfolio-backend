import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", ContactSchema);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/api/contact", async (req, res) => {
  try {
    console.log("Incoming:", req.body);
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Message sent successfully ✅" });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ message: "Database error ❌" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// ✅ Admin: Get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});
