import {
  Renderer,
  Scene,
  Mint,
  Vector,
  Pubsub,
  Event
} from "./nginy/index.mjs"

const canvas = document.querySelector("#canvas");
const scene = new Scene();
const renderer = new Renderer(canvas);
const mint = new Mint();
const pubsub = Pubsub.get();
const event = new Event();

const player = mint.create("rectangle", {
  pos: { x: 200, y: 380 },
  width: 15,
  height: 15,
  color: "green",
  name: "player"
})
.subscribe("collision",(a,b)=>{
  if(b.name=='wall') {
    a.acc.x = 0;
  }
})
.subscribe("collision",(a,b)=>{
  if(b.name=='fire') {
    alert("Game Over");
    scene.destory()
  }
});

for (let x = 0; x < 10; ++x) {
  for (let y = 0; y < 3; ++y) {
    scene.add(mint.create("rectangle", {
      pos: { x: 20 + x * 30, y: 20 + y * 30 },
      acc: { x: 0.9, y: 0.1 },
      width: 20,
      height: 20,
      color: "red",
      name: "enemy"
    })
    .subscribe("collision",(a,b)=>{
      if(b.name=="floor" || b.name=="player") {
        alert("Game Over");
        scene.destory()
      }
    })
    .subscribe("collision",(a,b)=>{
      if(b.name=='wall') {
        const c = scene.getObjectByName('enemy');
        for(const cs of c) {
          cs.acc.x = cs.acc.x * -1
        } 
      }
    })
    )
  }
}

scene.addMany([
  mint.create("rectangle", {
    pos: { x: 0, y: 0 },
    width: 400,
    height: 1,
    color: "blue",
    name: "sky"
  }),
  mint.create("rectangle", {
    pos: { x: 0, y: 1 },
    width: 1,
    height: 399,
    color: "blue",
    name: "wall"
  })
  .subscribe("collision",(a,b)=>{
    if(b.name=='enemy') {
      const c = scene.getObjectByName('enemy');
      for(const cs of c) {
        if(cs.acc.x < 0) {
          cs.acc.x = cs.acc.x * -1
        }
      } 
    }  else if(b.name == "player") {
      b.pos = new Vector({x:0,y:380});
    }
  }),
  mint.create("rectangle", {
    pos: { x: 399, y: 1 },
    width: 1,
    height: 399,
    color: "blue",
    name: "wall"
  })
  .subscribe("collision",(a,b)=>{
    if(b.name=='enemy') {
      const c = scene.getObjectByName('enemy');
      for(const cs of c) {
        if(cs.acc.x > 0) {
          cs.acc.x = cs.acc.x * -1
        }
      } 
    } else if(b.name == "player") {
      b.pos = new Vector({x:385,y:380});
    }
  }),
  mint.create("rectangle", {
    pos: { x: 0, y: 399 },
    width: 399,
    height: 1,
    color: "blue",
    name: "floor"
  })
])

pubsub.subscribe("keydown", (e) => {
  switch (e.keyCode) {
    case 37:
      player.acc = new Vector({ x: -2, y: 0 })
      break;
    case 39:
      player.acc = new Vector({ x: 2, y: 0 })
      break;
    case 32:
      const jump = Math.random();
      const a = ()=>{
        return mint.create("rectangle", {
          pos: player.pos,
          acc: { x: 0, y: -2 },
          color: "black",
          width: 2,
          height: 5,
          name: "bullet"
        })
        .subscribe("collision",(a,b)=>{
          if(b.name === 'sky') {
            scene.removeObjectById(a.id)
          }
        })
        .subscribe("collision",(a,b)=>{
          if(b.name === 'enemy') {
            scene.removeObjectById(a.id)
            scene.removeObjectById(b.id)
          }
        })
      }

      if(jump>0.3) {
        scene.add(a())
      }
      break;
  }
})

pubsub.subscribe("keyup", (e) => {
  switch (e.keyCode) {
    case 37:
      player.acc = new Vector({ x: 0, y: 0 })
      break;
    case 39:
      player.acc = new Vector({ x: 0, y: 0 })
      break;
  }
})

const fire = (type) => {
  if (scene.alive) {
    const a = scene.getObjectByName(type);
    const b = Math.random();
    const c = Math.random();
    const d = Math.floor(Math.random() * a.length)
    if (a.length > 0 && b > 0.5 && c > 0.9) {
      scene.add(mint.create("rectangle", {
        pos: a[d].pos,
        acc: { x: 0, y: 1 + Math.random() * 4 },
        color: "blue",
        width: 2,
        height: 5,
        name: "fire"
      })
      .subscribe("collision",(a,b)=>{
        if(b.name=='floor') {
          scene.removeObjectById(a.id)
        }
      })
      .subscribe("collision",(a,b)=>{
        if(b.name=='player') {
          alert("Game Over");
          scene.destory()
        }
      })
      )
    }
  }
}

scene.add(player)
event.listen();

const run = () => {
  requestAnimationFrame(run);
  fire('enemy')
  fire('fire')
  scene.update()
  renderer.render(scene)
}

requestAnimationFrame(run)







