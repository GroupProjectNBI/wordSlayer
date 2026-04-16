import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

/**
 * useWebsocket hook for connecting to SignalR and handling PlayerJoined events.
 * @param sessionId The game session ID (string)
 * @param onPlayerJoined Callback when a player joins (playerName: string) => void
 */
export function useWebsocket(sessionId: string | undefined, onPlayerJoined: (playerName: string) => void) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Create connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/gamehub")
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    // Listen for PlayerJoined events
    connection.on("PlayerJoined", (playerName: string) => {
      onPlayerJoined(playerName);
    });

    // Start connection and join group
    connection
      .start()
      .then(() => {
        // Call a method on the hub to join the group (if needed)
        connection.invoke("PlayerJoined", sessionId, ""); // Empty playerName for just joining group
      })
      .catch(console.error);

    return () => {
      connection.stop();
    };
  }, [sessionId, onPlayerJoined]);
}
