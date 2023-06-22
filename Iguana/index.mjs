import Event from "./event/event.mjs";
import pubsub from "./pubsub/pubsub.mjs";
import Box from "./tools/selection/box.mjs";
import Brush from "./tools/brushes/brush.mjs";
import Renderer from "./renderer/renderer.mjs";
import Layers from "./layer/layer.mjs";
import loadImage from "./utils/upload.mjs";
import Caretaker from "./memento/caretaker.mjs";

const { createApp, ref, onMounted, reactive, computed, watch } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify()

const app = createApp({
    setup() {
        //data
        const canvas = ref(null),
            activeLayer = ref(0),
            tab = null,
            tab1 = null,
            caretaker = reactive(Caretaker.get()),
            layers = reactive(Layers.get()),
            brush = new Brush();

        let isBoxSelected = false,
            isBrushSelected = false;
        //classes that use canvas after dom is mounted
        let event,
            box,
            renderer,
            listLayers = ref(layers.getLayers()),
            width = ref(0),
            height = ref(0);
        //computed values
        const mementos = computed(() => {
            return caretaker.getMementos();
        })
        //onmount dom
        onMounted(() => {
            const cnvs = canvas.value;
            renderer = new Renderer(cnvs);
            event = new Event(cnvs).listen();
            box = Box.get();
        });

        //event listeners
        pubsub.subscribe("drawbox", (dim) => {
            layers.add("selection", dim);
            renderer.render();
        })

        pubsub.subscribe("drawn", (dim) => {
            layers.add("selection", dim);
            renderer.render();
            caretaker.saveMemento(layers);
        })

        pubsub.subscribe("drawbrush", (obj) => {
            layers.add("brush", activeLayer.value, obj);
            renderer.render();
        })

        pubsub.subscribe("brushdrawn", (obj) => {
            layers.add("brush", activeLayer.value, obj);
            renderer.render();
            caretaker.saveMemento(layers);
            brush.reset()
        })

        pubsub.subscribe("iserasing", (obj) => {
            layers.add("eraser", activeLayer.value, obj);
            renderer.render();
        })

        pubsub.subscribe("erasingdone", (obj) => {
            layers.add("eraser", activeLayer.value, obj);
            renderer.render();
            caretaker.saveMemento(layers);
            brush.reset()
        })

        //methods
        const boxActivate = () => {
            brush.setBrushSelection(false);
            box.setBoxSelection(true);
            box.listen()
        }

        const brushActivate = () => {
            box.setBoxSelection(false);
            brush.set({
                isActive:true,
                blendMode:'multiply'
            });
            brush.listen()
        }

        const eraserActivate = () => {
            box.setBoxSelection(false);
            brush.set({
                isActive:true,
                blendMode:'destination-out',
                eventOn:"iserasing",
                eventDone:"erasingdone"
            });
            brush.listen()
        }

        const activate = (e) => {
            switch (e) {
                case "box":
                    boxActivate()
                    break;
                case "brush":
                    brushActivate()
                    break;
                case "eraser":
                    eraserActivate()
                    break;
            }
        }

        const addImage = async (image) => {
            let a = await loadImage(image);
            if (layers.getLayers() == 0) {
                const { width: w, height: h } = a;
                renderer.set({ width: w, height: h });
                const { width: ww, height: hh } = renderer.getCanvas();
                let b = new Image(ww,hh)
                b.src = a.src;
                a = b
                width.value = ww;
                height.value = hh;
            }
            console.log(a)
            layers.add("image", {
                blendMode: "normal"
            }, a);
            renderer.render();
            caretaker.saveMemento(layers);
        }

        const addLayer = async () => {
            const a = new Image();
            const { width, height } = renderer.getCanvas()
            a.width = width;
            a.height = height;
            layers.add("layer", {
                blendMode: "normal"
            }, a)
            renderer.render();
            caretaker.saveMemento(layers)
        }

        const addAdjustment = (a, ...args) => {
            layers.add(a, ...args)
            renderer.render();
            caretaker.saveMemento(layers);
        }

        const urdo = (a) => {
            caretaker.restoreMemento(a);
            listLayers.value = layers.getLayers();
            renderer.render();
        }

        const setVisibility = (index) => {
            layers.setVisibility(index)
            renderer.render()
        }

        return {
            canvas,
            isBoxSelected,
            isBrushSelected,
            listLayers,
            mementos,
            tab,
            tab1,
            activeLayer,
            width,
            height,
            //methods
            activate,
            addImage,
            addLayer,
            addAdjustment,
            urdo,
            setVisibility
        }
    }
})

app.use(vuetify).mount('#app')