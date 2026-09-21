const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());
app.post("/assignments", async (req, res) => {
    try {
        const { title, deadline } = req.body;

        const result = await pool.query(
            "INSERT INTO assignments (title, deadline) VALUES ($1, $2) RETURNING *",
            [title, deadline]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    console.log(`Server running on port ${PORT}`);
});
