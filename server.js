const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
res.send("Roblox Outfit API läuft!");
});

app.get("/outfits/", async (req, res) => {
try {
const userId = req.params.userId;

    const response = await fetch(
        `https://avatar.roblox.com/v2/avatar/users/${userId}/outfits?itemsPerPage=100&isEditable=true`
    );

    const data = await response.json();

   const outfits = (data.data || []).filter(outfit =>
    outfit.outfitType === "Avatar" &&
    outfit.isEditable === true
);
    );

    const ids = outfits.map(outfit => outfit.id).join(",");

    let thumbnails = {};

    if (ids.length > 0) {
        const thumbResponse = await fetch(
            `https://thumbnails.roblox.com/v1/users/outfits?userOutfitIds=${ids}&size=150x150&format=Png&isCircular=false`
        );

        const thumbData = await thumbResponse.json();

        for (const thumb of thumbData.data || []) {
            thumbnails[thumb.targetId] = thumb.imageUrl;
        }
    }

    const finalOutfits = outfits.map(outfit => ({
        id: outfit.id,
        name: outfit.name,
        image: thumbnails[outfit.id] || ""
    }));

    res.json({
        data: finalOutfits
    });

} catch (err) {
    res.status(500).json({
        error: err.message
    });
}
