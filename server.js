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
            `https://avatar.roblox.com/v2/avatar/users/${userId}/outfits?itemsPerPage=100`
        );

        const data = await response.json();

        const avatarOutfits = (data.data || []).filter(outfit =>
            outfit.outfitType === "Avatar"
        );

        const finalOutfits = [];

        for (const outfit of avatarOutfits) {
            let details = null;

            try {
                const detailResponse = await fetch(
                    `https://avatar.roblox.com/v1/outfits/${outfit.id}/details`
                );

                details = await detailResponse.json();
            } catch (err) {
                console.log("Details Fehler:", outfit.id, err.message);
            }

            finalOutfits.push({
                id: outfit.id,
                name: outfit.name,
                image: `rbxthumb://type=Outfit&id=${outfit.id}&w=420&h=420`,

                avatarType: details?.playerAvatarType || null,

                animations: {
                    idle: details?.idleAnimationAssetId || 0,
                    walk: details?.walkAnimationAssetId || 0,
                    run: details?.runAnimationAssetId || 0,
                    jump: details?.jumpAnimationAssetId || 0,
                    fall: details?.fallAnimationAssetId || 0,
                    climb: details?.climbAnimationAssetId || 0,
                    swim: details?.swimAnimationAssetId || 0,
                    mood: details?.moodAnimationAssetId || 0
                }
            });
        }

        res.json({
            data: finalOutfits
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
