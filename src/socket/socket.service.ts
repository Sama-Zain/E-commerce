import { SocketGateway } from './socket.gateway';
import { Injectable } from "@nestjs/common";

@Injectable()
export class SocketService {
    constructor(
        private readonly socketGateway: SocketGateway
    ) { }
    emitToRoom(room: string, event: string, data: any): void {
    this.socketGateway.server.to(room).emit(event,data)
    }
    emitToAll(event: string, data: any): void {
    this.socketGateway.server.emit(event,data)
    }
}