import { io } from "socket.io-client";
import { BASE_URL } from "./api";

// Connect socket - replace BASE_URL in api.js first
const socket = io(BASE_URL, { autoConnect: true });
export default socket;
