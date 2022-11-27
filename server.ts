import express from "express"
import { createServer } from "http"
import { PlayerService } from "./src/service/player-service"
import { Player } from "./src/model/player"
import { Server } from "socket.io"

const app = express()
const server = createServer(app)
const io = new Server(server)
const playerService = new PlayerService()
const sizeScreen = 600
const sizePlayer = 30
const SPEED = 5
const globalWeightScope = 0.06
const forceJumpToDown = -0.007
const PORT = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.set('views', './views')

app.get("/", (_, res) =>
{
       res.render(`index`, {
              sizeScreen: sizeScreen,
              sizePlayer: sizePlayer,
              SPEED: SPEED
       })
})

io.on("connection", socket =>
{
       const player = new Player({
              id: socket.id,
              x: Math.random() * (sizeScreen - sizePlayer),
              y: (sizeScreen - sizePlayer)
       })

       playerService.appendPlayerConnected(player)

       socket.emit("client-connected", player)

       function forceGravity(player: Player)
       {
              const weight = player.getWeight() + globalWeightScope

              player.setWeight(weight)

              const c = player.getY() + player.getWeight()

              player.setY(c)

              handleMoveClient(player)

              playerService.replacePlayer(socket.id, player)
       }
       function handleJump(player: Player)
       {
              let weight = player.getY()

              weight *= forceJumpToDown

              player.setWeight(weight)

              const c = player.getY() + player.getWeight()

              player.setY(c)

              handleMoveClient(player)

              playerService.replacePlayer(socket.id, player)
       }
       setInterval(() =>
       {
              const player = playerService.findPlayer(socket.id)

              const hasCollision = playerService.checkBorderCollision(player, sizeScreen, sizePlayer)

              if (!hasCollision && player) {

                     forceGravity(player)
              }

       }, 1000 / 60)

       socket.emit("client-connected", player)

       socket.on("handle-player-move", player =>
       {
              const newPlayer = playerService.findPlayer(socket.id)
              newPlayer.setX(player.x)
              newPlayer.setY(player.y)

              playerService.replacePlayer(socket.id, newPlayer)

              handleMoveClient(newPlayer)
       })

       socket.on("handle-player-move-jump", () =>
       {
              const player = playerService.findPlayer(socket.id)

              handleJump(player)
       })

       socket.on("disconnect", () =>
       {
              socket.broadcast.emit("handle-disconnect-player", socket.id)
       })

       function handleMoveClient(player: Player)
       {
              socket.broadcast.emit("client-player-has-moved", player)
              socket.emit("client-player-has-moved", player)

       }

})


server.listen(PORT)
