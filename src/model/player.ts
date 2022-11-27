type IPlayer = {
       id: string
       x: number
       y: number
}

export class Player
{
       private x: number
       private y: number
       private id: string
       private weight: number = 0
       constructor({
              x,
              y,
              id
       }: IPlayer)
       {
              this.x = x
              this.y = y
              this.id = id
       }

       getWeight()
       {
              return this.weight
       }

       setWeight(weight: number)
       {

              this.weight = weight
       }
       getId()
       {

              return this.id
       }

       setX(x: number)
       {

              this.x = x
       }
       setY(y: number)
       {
              this.y = y
       }

       getY()
       {

              return this.y
       }

       getX()
       {

              return this.x
       }
}
