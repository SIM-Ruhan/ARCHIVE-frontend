"use client";
import { Button } from "@heroui/react";

const UpgradePremiumButton = () => {
    const updateToPremium = async () => {
        const res = await fetch("/api/checkout_sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ type: "subscription" })
        });
        const data = await res.json();
        // console.log(data);
        if (data?.url) {
            window.location.href = data.url;
        }

    }
    return (
        <Button
            onClick={updateToPremium}
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold h-11 px-6 shadow-lg shadow-yellow-500/10 shrink-0" radius="lg">
            Upgrade to Premium
        </Button>
    );
};

export default UpgradePremiumButton;