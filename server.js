const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Roblox Outfit API läuft!");
});

app.get("/outfits/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const response = await fetch(
            `https://avatar.roblox.com/v2/avatar/users/${userId}/outfits?itemsPerPage=50`
        );

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
