import Quadtree from "./nginy/data/qtree.mjs";
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
});

for (let x = 0; x < 10; ++x) {
  for (let y = 0; y < 1; ++y) {
    scene.add(mint.create("rectangle", {
      pos: { x: 20 + x * 30, y: 20 + y * 30 },
      acc: { x: 0.5, y: 0.1 },
      width: 20,
      height: 20,
      color: "red",
      name: "enemy"
    }))
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
    name: "lwall"
  }),
  mint.create("rectangle", {
    pos: { x: 399, y: 1 },
    width: 1,
    height: 399,
    color: "blue",
    name: "rwall"
  }),
  mint.create("rectangle", {
    pos: { x: 0, y: 399 },
    width: 399,
    height: 1,
    color: "blue",
    name: "floor"
  })
])

pubsub.subscribe("collision", (a, b) => {
  if (a.name == 'bullet' && b.name == 'sky') {
    scene.removeObjectById(a.id)
  } else if (b.name == 'bullet' && a.name == 'sky') {
    scene.removeObjectById(b.id)
  }

  if (a.name == 'fire' && b.name == 'floor') {
    scene.removeObjectById(a.id)
  } else if (b.name == 'fire' && a.name == 'floor') {
    scene.removeObjectById(b.id)
  }

  if (a.name == 'bullet' && b.name == 'enemy' || b.name == 'bullet' && a.name == 'enemy') {
    scene.removeObjectById(b.id)
    scene.removeObjectById(a.id)
  }

  if (a.name == "enemy" && b.name == "floor" || b.name == "enemy" && a.name == "floor") {
    alert("game over")
    scene.destory()
  }

  if (a.name == "enemy" && b.name == "player" || b.name == "enemy" && a.name == "player") {
    alert("game over")
    scene.destory()
  }

  if (a.name == "fire" && b.name == "player" || b.name == "fire" && a.name == "player") {
    alert("game over")
    scene.destory()
  }

  if (a.name == "enemy" && b.name == "rwall" || b.name == "enemy" && a.name == "rwall") {
    const c = scene.getObjectByName('enemy')
    c.forEach(i => {
      const a = i.acc;
      if (a.x > 0) {
        a.x = a.x * -1
      }
      i.acc = new Vector(a)
    })
  }

  if (a.name == "enemy" && b.name == "lwall" || b.name == "enemy" && a.name == "lwall") {
    const c = scene.getObjectByName('enemy')
    c.forEach(i => {
      const a = i.acc;
      if (a.x < 0) {
        a.x = a.x * -1
      }
      i.acc = new Vector(a)
    })
  }

  if (a.name == "player" && b.name == "rwall" || b.name == "player" && a.name == "rwall") {
    const c = scene.getObjectByName('player')[0];
    const a = c.acc;
    if (a.x > 0) {
      a.x = a.x * -1
    }
    c.acc = new Vector(a);
  }

  if (a.name == "player" && b.name == "lwall" || b.name == "player" && a.name == "lwall") {
    const c = scene.getObjectByName('player')[0];
    const a = c.acc;
    if (a.x < 0) {
      a.x = a.x * -1
    }
    c.acc = new Vector(a);
  }
});

pubsub.subscribe("keydown", (e) => {
  switch (e.keyCode) {
    case 37:
      player.acc = new Vector({ x: -1, y: 0 })
      break;
    case 39:
      player.acc = new Vector({ x: 1, y: 0 })
      break;
    case 32:
      scene.add(mint.create("rectangle", {
        pos: player.pos,
        acc: { x: 0, y: -2 },
        color: "black",
        width: 2,
        height: 5,
        name: "bullet"
      }))
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

const fire = () => {
  if (scene.alive) {
    const a = scene.getObjectByName('enemy');
    const b = Math.random();
    const c = Math.random();
    const d = Math.floor(Math.random() * a.length)
    if (a.length > 0 && b > 0.7 && c > 0.9) {
      scene.add(mint.create("rectangle", {
        pos: a[d].pos,
        acc: { x: 0, y: 1 + Math.random() * 3 },
        color: "blue",
        width: 2,
        height: 5,
        name: "fire"
      }))
    }
  }
}

scene.add(player)
event.listen();

//console.log(new Quadtree())
const run = () => {
  //setTimeout(() => {
    requestAnimationFrame(run);
  //}, 5000)

  fire()
  scene.update()
  renderer.render(scene)
}

requestAnimationFrame(run)







