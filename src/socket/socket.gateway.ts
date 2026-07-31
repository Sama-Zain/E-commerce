import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket,Server} from "socket.io";
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server
    handleConnection(client: Socket){
            console.log(`Live Stream Client Connect: ${client.id}`);
        }
    
    handleDisconnect(client: Socket){
            console.log(`Live Stream Client Disconnect: ${client.id}`);
        }
        handleJoinRoom(
            @MessageBody() roomName:string,
            @ConnectedSocket() client:Socket,
        ) {
            client.join(roomName);
            console.log(`Client ${client.id} joined channel room: ${roomName}`);
            return {status: "success",joinde:roomName}
            
        }
    }
