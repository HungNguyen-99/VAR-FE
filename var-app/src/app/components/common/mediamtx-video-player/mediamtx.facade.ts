import { inject, Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { ObjDbClickSentToReferee } from "../../../interfaces/Object-to-referee.interface";
import { WebSocketService } from "../../../services/web-socket.service";

@Injectable()
export class MediamtxVideoPlayerFacade extends ComponentStore<any> {

    private readonly _webSocketService = inject(WebSocketService);

    dbClick(objSentToReferee: ObjDbClickSentToReferee): void {
        this._webSocketService!.sendMessage(objSentToReferee);
    }

}