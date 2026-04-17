import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export function useWebsocket(
    sessionId: string | undefined,
    playerName: string,
    onPlayerJoined: (playerName: string) => void,
    onTurnChanged: (nextTurn: "player1" | "player2", p1Hp: number, p2Hp: number) => void
) {
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!sessionId) return;
        if (connectionRef.current) return; // Förhindra dubbla anslutningar

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/gamehub")
            .withAutomaticReconnect()
            .build();

        // Lyssna på när någon ansluter
        connection.on("PlayerJoined", (name: string) => {
            onPlayerJoined(name);
        });

        // Lyssna på när servern växlar tur
        connection.on("TurnChanged", (nextTurn: "player1" | "player2", p1Hp: number, p2Hp: number) => {
            console.log("SignalR Update:", { nextTurn, p1Hp, p2Hp });
            onTurnChanged(nextTurn, p1Hp, p2Hp); // Skicka vidare alla tre värden
        });

        connection.start()
            .then(() => {
                // Skicka med det riktiga namnet till hubben
                connection.invoke("PlayerJoined", sessionId, playerName);
            })
            .catch(console.error);

        connectionRef.current = connection;

        return () => {
            connection.stop();
            connectionRef.current = null;
        };
    }, [sessionId, playerName, onPlayerJoined, onTurnChanged]); // Stabilt tack vare useCallback
}