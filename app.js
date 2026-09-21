const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());
// one
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
        res.status(500).json({ message: "errooor", error: err.message });
    }
});

// two
app.get("/assignments", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM assignments ORDER BY id DESC"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "errooor", error: err.message });
    }
});

// three
app.patch("/assignments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "UPDATE assignments SET submitted = true WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "errooor", error: err.message });
    }
});

// four
app.delete("/assignments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM assignments WHERE id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        res.json({
            message: "Assignment deleted successfully",
            assignment: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "errooor", error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    console.log(`Server running on port ${PORT}`);
});
