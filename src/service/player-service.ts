import { Player } from "../model/player"

type ObjectPlayerReference = {
       [key: string]: Player,
}

export class PlayerService
{
       private players: ObjectPlayerReference = {}
       appendPlayerConnected(player: Player)
       {
              this.players[player.getId()] = player
       }

       replacePlayer(id: string, player: Player)
       {

              this.players[id] = player
       }

       findPlayer(id: string)
       {

              return this.players[id]
       }
       getListPlayers()
       {
              return this.players
       }


       checkBorderCollision(player: Player, sizeScreen: number, sizePlayer: number) : boolean {

              if (
                     player.getY() > (sizeScreen - sizePlayer)
              ) {
                     return true
              }

              return false
       }

}